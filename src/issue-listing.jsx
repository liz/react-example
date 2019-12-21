import React, { Component } from 'react';
import styled from 'styled-components';
import Octokit from '@octokit/rest';

const SortArrow = styled.span`
	display: inline-block;
	height: 0;
	width: 0;
	border-left: 5px solid transparent;
	border-right: 5px solid transparent;

	&.asc {
		border-bottom: 5px solid black;
	}

	&.desc {
		border-top: 5px solid black;
	}
`;
SortArrow.displayName = 'SortArrow';


export default class IssueListing extends Component {
	   constructor(props) {
        super(props);

        this.state = {
            issues: '',
            sort: {
           		column: 'created_at',
           		direction: 'desc'
            }
        };
    }

    fetchIssues = () => {
    	const octokit = new Octokit({
            auth: this.props.apiKey
        });

        octokit.issues.listForRepo({
        	owner: this.props.user,
        	repo: this.props.selectedRepo
        }).then(({ data }) => {
                this.setState({
                    issues: data
                });
                console.log("issues goes")
                console.log(data)
            });
    };

    componentDidUpdate(prevProps) {
        if (prevProps.selectedRepo !== this.props.selectedRepo) {
            this.fetchIssues();
        }
    }

    onSort = (column) => (e) => {
        const direction = this.state.sort.column ? (this.state.sort.direction === 'asc' ? 'desc' : 'asc') : 'desc';

        const sortedData = this.state.issues.sort((a, b) => {
		if (column === 'title') {
			const titleA = a.title.toUpperCase();
			const titleB = b.title.toUpperCase(); 

			if (titleA < titleB) {
				return -1;
			}

			if (titleA > titleB) {
				return 1;
			}

			return 0;

			} else if (column === 'updated_at') {
				return a.updated_at - b.updated_at; 
			} else {
				return a.created_at - b.created_at;
			}
        });
          
        if (direction === 'desc') {
          sortedData.reverse();
        }
        
        this.setState({
          data: sortedData,
          sort: {
            column,
            direction,
          }
        });
      };

       setArrow = (column) => {
        let className = 'sort-direction';
        
        if (this.state.sort.column === column) {
        	console.log("set arrow IF RAN, column:")
      		console.log(column)
      		console.log('this.state.sort.direction:', this.state.sort.direction)
        	className += this.state.sort.direction === 'asc' ? ' asc' : ' desc';
        }
        
        return className;
    };

    render() {
    	if (this.state.issues && this.state.issues.length) {
			return (
				<table>
					<thead>
						<tr>
							<th>
								<button 
									onClick={this.onSort('avatar_url')}  
								>
									Assignee <SortArrow className={this.setArrow('avatar_url')}></SortArrow>
								</button>
							</th>
							<th>
								<button 
									onClick={this.onSort('title')}  
								>
									Title <SortArrow className={this.setArrow('title')}></SortArrow>
								</button>
							</th>
							<th>
								<button 
									onClick={this.onSort('created_at')}  
								>
									Created Time <SortArrow className={this.setArrow('created_at')}></SortArrow>
								</button>
							</th>
							<th>
								<button 
									onClick={this.onSort('last_updated')}  
								>
									Last Updated <SortArrow className={this.setArrow('last_updated')}></SortArrow>
								</button>
							</th>
						</tr>
					</thead>
					<tbody>
						{this.state.issues && this.state.issues.map(function(issue, index) {
							return (
								<tr key={index}>
									<td>
										<img src={issue.avatar_url} alt="" width="25px" />
									</td>
									<td>{issue.title}</td>
									<td>{issue.created_at}</td>
									<td>{issue.updated_at}</td>
								</tr>
							);
						})}
					</tbody>
				</table>
		    );
    	}

    	return <p>Please select a repo from the lefthand column</p>;
    }

}