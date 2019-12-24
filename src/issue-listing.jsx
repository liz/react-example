import React, { Component } from 'react';
import styled from 'styled-components/macro';
import Octokit from '@octokit/rest';
import Moment from 'react-moment';
import SimpleStorage from "react-simple-storage";

import theme from './theme';
import mediaQueries from './media-queries';

import { Container } from './components/container';
import { Row } from './components/row';
import { LoadingSpinner } from './components/loading-spinner';
import { FormInput } from './components/form-input';
import { Image } from './components/image';
import { Button } from './components/button';
import SmallArrow from './components/small-arrow';

const IssueListingContainer = styled(Container)`
	&.no-repo-selected {
		display: none;

		@media (min-width: ${mediaQueries.min.medium}) {
			display: block;
		}
	}
`;
IssueListingContainer.displayName = 'IssueListingContainer';

const NoIssuesMessage = styled.p`
    // padding-left: ${theme.gutter};

    // @media (min-width: ${mediaQueries.min.medium}) {
    //     padding-left: 0;
    // }
`;
NoIssuesMessage.displayName = 'NoIssuesMessage';

const MobileSort = styled.div`
    display: block;
    // padding-left: ${theme.gutter};
    // padding-right: ${theme.gutter};
    // margin-bottom: 0.5rem;

    @media (min-width: ${mediaQueries.min.medium}) {
        display: none;
    }
`;
NoIssuesMessage.displayName = 'NoIssuesMessage';

// const IssueListingContainerNoMobilePadding = styled(IssueListingContainer)`
//     padding-left: 0;
//     padding-right: 0;
//     // overflow-x: auto;
//     // overflow-y: hidden;

//     @media (min-width: ${mediaQueries.min.medium}) {
//         padding-left: ${theme.gutter};
//         padding-right: ${theme.gutter};
//     }
// `;
// IssueListingContainerNoMobilePadding.displayName = 'IssueListingContainerNoMobilePadding';

const FullWidthCol = styled.div`
    width: 100%;
    padding-left: ${theme.gutter};
    padding-right: ${theme.gutter};
`;
FullWidthCol.displayName = 'FullWidthCol';

// const FullWidthColNoPadding = styled.div`
//     width: 100%;
// `;
// FullWidthColNoPadding.displayName = 'FullWidthColNoPadding';

const Table = styled.table`
	width: 100%;
    table-layout: auto;
    margin-top: 0;
    font-size: ${theme.xxsmallBaseFont};
    font-size: ${theme.xxxxsmallBaseFont};

    // @media (min-width: ${mediaQueries.min.medium}) {
    // 	font-size: ${theme.smallBaseFont};
    // }

    td {
        padding: 10px 5px;
        text-align: center;

        @media (min-width: ${mediaQueries.min.medium}) {
            padding: 1.5rem ${theme.gutter};
        }
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

            @media (min-width: ${mediaQueries.min.medium}) {
            	max-width: 350px;
            }
        }
    }

    &, thead, tbody, th, tr {
    	@media (max-width: ${mediaQueries.max.medium}) {
    		display: block;
    	}
    }

    thead tr {
    	@media (max-width: ${mediaQueries.max.medium}) {
    		display: flex;
            flex-direction: column;
    	}

        // &.slideup, &.slidedown {
        //     @media (min-width: ${mediaQueries.min.medium}) {
        //         max-height: 100%;
        //     }
        // }

        // &.slideup {
        //     max-height: 41px;
        // }
    }

    // thead tr th:nth-of-type(3) {
    //     @media (max-width: ${mediaQueries.max.medium}) {
    //         order: -1;
    //     }
    // }

    td {
    	@media (max-width: ${mediaQueries.max.medium}) {
    		display: flex;
    		align-items: center;
    		justify-content: space-between;
            min-height: 40px;
            max-width: 100%;

	  		// border: none;
			// border-bottom: 1px solid #eee; 
			// position: relative;
			// padding-left: 50%; 
    	}
    }

    td:before { 
    	@media (max-width: ${mediaQueries.max.medium}) {
    		position: static;
    		margin-right: ${theme.gutter};
    		color: ${theme.primaryColor};
    		font-weight: bold;
    		font-size: ${theme.smallBaseFont};
        }
    }

	td:nth-of-type(1):before {
		@media (max-width: ${mediaQueries.max.medium}) {
			{ content: "Assignee"; }
		}
	}

	td:nth-of-type(2):before {
		@media (max-width: ${mediaQueries.max.medium}) {
			{ content: "Title"; }
		}
	}

	td:nth-of-type(3):before {
		@media (max-width: ${mediaQueries.max.medium}) {
			{ content: "Created Time"; }
		}
	}

	td:nth-of-type(4):before {
		@media (max-width: ${mediaQueries.max.medium}) {
			{ content: "Last Updated"; }
		}
	}
`;

const TableHeader = styled.thead`
    th {
        border-bottom: 0;
        background: ${theme.backgroundAlt};
    }

    button {
    	width: 100%;
    	height: 100%;
        // padding: 5px;
        padding: 0.75rem ${theme.gutter};
        font-size: ${theme.smallBaseFont};
    	// font-size: ${theme.xxxxsmallBaseFont};

    	// @media (min-width: ${mediaQueries.min.medium}) {
    	// 	font-size: ${theme.smallBaseFont};
     //        padding: 0.75rem ${theme.gutter};
    	// }

        *[class*='button__Icon'] {
            transform: scale(0.7);

            @media (min-width: ${mediaQueries.min.medium}) {
                transform: scale(1);
            }
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
        	owner: this.props.selectedRepo.owner.login,
        	repo: this.props.selectedRepo.name
        }).then(({ data }) => {
        		console.log(data)
                this.setState({
                    issues: data,
                    isLoaded: true
                });
                console.log("column in fetch", this.state.sort.column)
                console.log(this.state.sort.direction)
                this.onSort(null, this.state.sort.column)
                this.setArrow(this.state.sort.direction)
            }).catch(err => {
            	console.log(err)
            	this.setState({
                    issues: [],
                    isLoaded: true
                });
            });
    };

    componentDidUpdate(prevProps) {
        if (prevProps.selectedRepo !== this.props.selectedRepo) {
        	if (this.props.selectedRepo) {
        		this.setState({ isLoaded: false });
            	this.fetchIssues();
        	}
        }
    }

  //   onSort = (column) => (e) => {
  //       console.log("onSort ran", column)
  //       console.log("onSort ran", e)
  //       const direction = this.state.sort.column ? (this.state.sort.direction === 'asc' ? 'desc' : 'asc') : 'desc';
  //       const sortedData = this.state.issues.sort((a, b) => {
		// if (column === 'title') {
		// 	const titleA = a.title.toUpperCase();
		// 	const titleB = b.title.toUpperCase(); 

		// 	if (titleA < titleB) {
		// 		return -1;
		// 	}

		// 	if (titleA > titleB) {
		// 		return 1;
		// 	}

		// 	return 0;

		// 	} else if (column === 'updated_at') {
		// 		return a.updated_at - b.updated_at; 
		// 	} else {
		// 		return a.created_at - b.created_at;
		// 	}
  //       });
          
  //       if (direction === 'desc') {
  //         sortedData.reverse();
  //       }
        
  //       this.setState({
  //         issues: sortedData,
  //         sort: {
  //           column,
  //           direction,
  //         }
  //       });
  //   };

    //   onSort = (e, column) => {
    //     console.log("onSort ran", column)
    //     console.log("onSort ran", e)
    //     console.log("onSort ran, current: direction", this.state.sort.direction)
    //     const direction = this.state.sort.column ? (this.state.sort.direction === 'asc' ? 'desc' : 'asc') : 'desc';

    //     const sortedData = this.state.issues.sort((a, b) => {
    //     if (column === 'title') {
    //         const titleA = a.title.toUpperCase();
    //         const titleB = b.title.toUpperCase(); 

    //         if (titleA < titleB) {
    //             return -1;
    //         }

    //         if (titleA > titleB) {
    //             return 1;
    //         }

    //         return 0;

    //         } else if (column === 'updated_at') {
    //             return a.updated_at - b.updated_at; 
    //         } else {
    //             console.log('this goes again')
    //             return a.created_at - b.created_at;
    //         }
    //     });
          
    //     if (direction === 'desc') {
    //         console.log("desc")
    //         sortedData.reverse();
    //     } else {
    //         console.log("else, probably asc")
    //     }
        
    //     this.setState({
    //       issues: sortedData,
    //       sort: {
    //         column,
    //         direction,
    //       }
    //     });
    // };

    onSort = (e, column) => {
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
            } else if (column === 'avatar_url') {
                // return a.assignee && a.assignee.login - b.assignee && b.assignee.login; 
                const assigneeA = a.assignee && a.assignee.login.toUpperCase();
	            const assigneeB = b.assignee && b.assignee.login.toUpperCase(); 
	            if (assigneeA < assigneeB) {
	            	console.log('first if ran')
	                return -1;
	            }
	            if (assigneeA > assigneeB) {
	            	console.log('second if ran')
	                return 1;
	            }
	            console.log('main return ran')
	            return 0;
            } else if (column === 'updated_at') {
                return new Date(b.updated_at) - new Date(a.updated_at);
            } else {
                return new Date(b.created_at) - new Date(a.created_at);
            }
        });
          
        if (direction === 'desc') {
        	console.log('reverse ran')
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
                <div>
                    <MobileSort>
                        <form>
                        	<fieldset>
                        		<label for="sort">Sort by:</label>
	                            <FormInput
	                                fieldChange={(e) => this.onSort(e, e.target.value)}
	                                fieldValue={this.state.sort.column}
	                                fieldType="select"
	                                fieldName="sort"
	                            >
	                                 <option value="created_at">Created Time</option>
	                                 <option value="avatar_url">Asignee</option>
	                                 <option value="title">Title</option>
	                                 <option value="updated_at">Last Updated</option>
	                            </FormInput>
                            </fieldset>
                        </form>
                    </MobileSort>
    				<Table>
    					<TableHeader>
    						<tr 
                                className={this.state.sortAccordionOpen ? 'slidedown' : 'slideup'}
                            >
    							<th>
    								<Button 
    									handleClick={(e) => this.onSort(e, 'avatar_url')} 
    									buttonText="Assignee"
    									icon={<SmallArrow className={this.setArrow('avatar_url')}></SmallArrow>}
    									iconOnRight
    									className="btn btn--link"
    								/>
    							</th>
    							<th>
    								<Button 
    									handleClick={(e) => this.onSort(e, 'title')}  
    									buttonText="Title"
    									icon={<SmallArrow className={this.setArrow('title')}></SmallArrow>}
    									iconOnRight
    									className="btn btn--link"
    								/>
    							</th>
    							<th>
    								<Button 
    									handleClick={(e) => this.onSort(e, 'created_at')}
    									buttonText="Time Created"
    									icon={<SmallArrow className={this.setArrow('created_at')}></SmallArrow>}
    									iconOnRight
    									className="btn btn--link"
    								/>
    							</th>
    							<th>
    								<Button 
    									handleClick={(e) => this.onSort(e, 'last_updated')}  
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
                </div>
		    );
    	}

    	if (this.state.isLoaded && this.state.issues && !this.state.issues.length) {
    		return <NoIssuesMessage>This repo has no issues.</NoIssuesMessage>;
    	}
    	
    	return <LoadingSpinner />;
    };

    renderIssues  = () => {
    	if (this.state.isLoaded === null) {
    		return <p>Please select a repo from the lefthand column</p>;
    	}

    	return this.renderIssueTable();
    };

    renderRepoName  = () => {
        if (this.props.selectedRepo &&this.props.selectedRepo.name ) {
            return (
                <span>for <span className="highlight">{this.props.selectedRepo.name}</span></span>
            );
        }

        return null;
    };

    render() {
    	return (
            <div>
            	<SimpleStorage parent={this} />
        		<IssueListingContainer 
                    className={this.props.className}
                >
                    <Row>
            			<FullWidthCol>
                            <h2>Issues {this.renderRepoName()}</h2>
                            {this.renderIssues()}
                        </FullWidthCol>
                    </Row>
                </IssueListingContainer>
            </div>
    	);
    }

    // render() {
    // 	return (
    //         <div>
    //         	<SimpleStorage parent={this} />
    //     		<IssueListingContainer 
    //                 className={this.props.className}
    //                 maxWidth="100%"
    //             >
    //                 <Row>
    //         			<FullWidthCol>
    //                         <h2>Issues {this.renderRepoName()}</h2>
    //                     </FullWidthCol>
    //                 </Row>
    //             </IssueListingContainer>
    //             <IssueListingContainerNoMobilePadding 
    //                 className={this.props.className}
    //                 maxWidth="100%"
    //             >
    //                 <Row>
    //                     <FullWidthCol>
    //                         {this.renderIssues()}
    //                     </FullWidthCol>
    //                 </Row>
    //     		</IssueListingContainerNoMobilePadding>
    //         </div>
    // 	);
    // }



    // render() {
    // 	if (this.state.isLoaded === null) {
    // 		return <p>Please select a repo from the lefthand column</p>;
    // 	}

    // 	return this.renderIssueTable();
    // }

    //  render() {
    // 	if (this.state.isLoaded === null) {
    // 		return <p>Please select a repo from the lefthand column</p>;
    // 	}

    // 	return (
    // 		<div>
	   //  		{this.renderIssueTable()}
    // 		</div>
    // 	);
    // }
}