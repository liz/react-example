import React, { Component } from 'react';
import styled from 'styled-components/macro';
import Octokit from '@octokit/rest';
import Moment from 'react-moment';

import theme from './theme';
import mediaQueries from './media-queries';

import { LoadingSpinner } from './components/loading-spinner';
import { Image } from './components/image';
import { Button } from './components/button';
import SmallArrow from './components/small-arrow';

const Table = styled.table`
	width: 100%;
    table-layout: auto;
    margin-top: 0;
    font-size: ${theme.xxsmallBaseFont};

    @media (min-width: ${mediaQueries.min.medium}) {
    	font-size: ${theme.smallBaseFont};
    }

    td {
        padding: 1.5rem ${theme.gutter};
        text-align: center;
    }

    td,
    tr {
        vertical-align: middle;
    }

    tr {
        &:nth-child(even) {
            background: ${theme.backgroundAlt};
        }

        td {
            border-bottom: 0;
            max-width: 350px;
        }
    }

 //    &, thead, tbody, th, tr {
 //    	@media (max-width: ${mediaQueries.max.medium}) {
 //    		display: block;
 //    	}
 //    }

 //    thead tr {
 //    	@media (max-width: ${mediaQueries.max.medium}) {
 //    		display: none;
 //    	}
 //    }

 //    td {
 //    	@media (max-width: ${mediaQueries.max.medium}) {
 //    		display: flex;
 //    		align-items: center;
 //    		justify-content: space-between;

	//   		// border: none;
	// 		// border-bottom: 1px solid #eee; 
	// 		// position: relative;
	// 		// padding-left: 50%; 
 //    	}
 //    }

 //    td:before { 
 //    	@media (max-width: ${mediaQueries.max.medium}) {
 //    		position: static;
 //    		margin-right: ${theme.gutter};
 //    		color: ${theme.primaryColor};
 //    		font-weight: bold;
 //    		font-size: ${theme.smallBaseFont};


 //   			// position: absolute;
	// 		// top: 6px;
	// 		// left: 6px;
	// 		// width: 45%; 
	// 		// padding-right: 10px; 
	// 		// white-space: nowrap;
 //    	}
	// }

	// td:nth-of-type(1):before {
	// 	@media (max-width: ${mediaQueries.max.medium}) {
	// 		{ content: "Assignee"; }
	// 	}
	// }

	// td:nth-of-type(2):before {
	// 	@media (max-width: ${mediaQueries.max.medium}) {
	// 		{ content: "Title"; }
	// 	}
	// }

	// td:nth-of-type(3):before {
	// 	@media (max-width: ${mediaQueries.max.medium}) {
	// 		{ content: "Created Time"; }
	// 	}
	// }

	// td:nth-of-type(4):before {
	// 	@media (max-width: ${mediaQueries.max.medium}) {
	// 		{ content: "Last Updated"; }
	// 	}
	// }
`;

const TableHeader = styled.thead`
    th {
        border-bottom: 0;
        background: ${theme.backgroundAlt};
    }

    button {
    	width: 100%;
    	height: 100%;
    	padding: 0.75rem ${theme.gutter};
    	font-size: ${theme.xxsmallBaseFont};

    	@media (min-width: ${mediaQueries.min.medium}) {
    		font-size: ${theme.baseFontSize};
    	}
    }
`;

// const SortArrow = styled.span`
// 	height: 0;
// 	width: 0;
// 	border-left: 5px solid transparent;
// 	border-right: 5px solid transparent;

// 	&.asc {
// 		border-bottom: 5px solid ${(props) => props.color};;
// 	}

// 	&.desc {
// 		border-top: 5px solid ${(props) => props.color};;
// 	}
// `;
// SortArrow.displayName = 'SortArrow';

// SortArrow.defaultProps = {
// 	color: theme.primaryColor
// }

export default class IssueListing extends Component {
	   constructor(props) {
        super(props);

        this.state = {
            issues: null,
            sort: {
           		column: 'created_at',
           		direction: 'desc'
            },
            isLoaded: null
        };
    }

    fetchIssues = () => {
    	const octokit = new Octokit({
            auth: this.props.apiKey
        });

        octokit.issues.listForRepo({
        	owner: this.props.selectedRepoOwner,
        	repo: this.props.selectedRepoName
        }).then(({ data }) => {
        		console.log(data)
                this.setState({
                    issues: data,
                    isLoaded: true
                });
            }).catch(err => {
            	console.log(err)
            	this.setState({
                    issues: [],
                    isLoaded: true
                });
            });
    };

    componentDidUpdate(prevProps) {
        if (prevProps.selectedRepoName !== this.props.selectedRepoName) {
        	if (this.props.selectedRepoOwner && this.props.selectedRepoName) {
        		this.setState({ isLoaded: false });
            	this.fetchIssues();
        	}
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
          issues: sortedData,
          sort: {
            column,
            direction,
          }
        });
      };

       setArrow = (column) => {
        let className = 'sort-direction';
        
        if (this.state.sort.column === column) {
        	className += this.state.sort.direction === 'asc' ? ' asc' : ' desc';
        }
        
        return className;
    };

    renderIssueTable  = () => {
    	if (this.state.isLoaded && this.state.issues && this.state.issues.length) {
			return (
				<Table>
					<TableHeader>
						<tr>
							<th>
								<Button 
									handleClick={this.onSort('avatar_url')} 
									buttonText="Assignee"
									icon={<SmallArrow className={this.setArrow('avatar_url')}></SmallArrow>}
									iconOnRight
									className="btn btn--link"
								/>
							</th>
							<th>
								<Button 
									handleClick={this.onSort('title')}  
									buttonText="Title"
									icon={<SmallArrow className={this.setArrow('title')}></SmallArrow>}
									iconOnRight
									className="btn btn--link"
								/>
							</th>
							<th>
								<Button 
									handleClick={this.onSort('created_at')}
									buttonText="Time Created"
									icon={<SmallArrow className={this.setArrow('created_at')}></SmallArrow>}
									iconOnRight
									className="btn btn--link"
								/>
							</th>
							<th>
								<Button 
									handleClick={this.onSort('last_updated')}  
									buttonText="Last Updated"
									icon={<SmallArrow className={this.setArrow('last_updated')}></SmallArrow>}
									iconOnRight
									className="btn btn--link"
								/>
							</th>
						</tr>
					</TableHeader>
					<tbody>
						{this.state.issues && this.state.issues.map(function(issue, index) {
							return (
								<tr key={index}>
									<td>
										{(issue.assignee && issue.assignee.avatar_url) ? <Image src={issue.assignee.avatar_url} alt={issue.assignee.login} width="40px" height="40px" /> : "None"}
									</td>
									<td>{issue.title}</td>
									<td>
										<Moment format="MM/DD/YYYY">
							                {issue.created_at}
							            </Moment>
									</td>
									<td>
										<Moment fromNow>
											{issue.updated_at}
										</Moment>
									</td>
								</tr>
							);
						})}
					</tbody>
				</Table>
		    );
    	}

    	if (this.state.isLoaded && this.state.issues && !this.state.issues.length) {
    		return <p>This repo has no issues.</p>;
    	}
    	
    	return <LoadingSpinner />;
    };

     render() {
    	if (this.state.isLoaded === null) {
    		return <p>Please select a repo from the lefthand column</p>;
    	}

    	return (
    		<div>
	    		{this.renderIssueTable()}
    		</div>
    	);
    }
}