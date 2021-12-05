import React, { Component } from 'react';
import { Card, CardImg, CardText, CardBody, Breadcrumb, BreadcrumbItem, Modal, ModalHeader, Button, Label } from 'reactstrap';
import { Link } from 'react-router-dom';
import { LocalForm, Control, Errors } from 'react-redux-form';
import {Loading} from './LoadingComponent';
import {baseUrl} from '../shared/baseUrl';

const required = val => val && val.length;
const maxLength = len => val => !val || (val.length <= len);
const minLength = len => val => val && (val.length >= len);

class CommentForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isModalOpen: false,
            author: '',
            rating: '',
            text: '',
            touched: {
                author: false,
                text: false
            }
        }
        this.toggleModal = this.toggleModal.bind(this);
    }

    handleSubmit(values) {
        this.toggleModal()
        this.props.postComment(this.props.campsiteId, values.rating, values.author, values.text)

    }
    toggleModal() {
        this.setState({
            isModalOpen: !this.state.isModalOpen
        })
    }
    render() {
        return (
            <React.Fragment>
                <Button outline onClick={this.toggleModal}>
                    <i className="fa fa-comment fa-lg" /> Submit Comment
                </Button>
                <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
                    <ModalHeader toggle={this.toggleModal}>We Welcome Feedback</ModalHeader>
                    <LocalForm onSubmit={values => this.handleSubmit(values)}>
                        <div className="form-group">
                            <Label htmlFor="author" md={2}>Author</Label>
                            <Control.text model=".author" id="author" name="author"
                                placeholder="Your Name"
                                className="form-control"
                                validators={{
                                    required,
                                    minLength: minLength(2),
                                    maxLength: maxLength(15)
                                }}
                            />
                            <Errors
                                className="text-danger"
                                model=".author"
                                show="touched"
                                component="div"
                                messages={{
                                    required: "Required",
                                    minLength: "Must be at least 2 characters",
                                    maxLength: "Must be at most 15 characters"
                                }}
                            />
                        </div>
                        <div className="form-group">
                            <Label htmlFor="rating" md={2}>Rating</Label>
                            <Control.select model=".rating" id="rating" name="rating"
                                className="form-control"
                                validators={{
                                    required
                                }}
                            >
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                            </Control.select>
                            <Errors
                                className="text-danger"
                                model=".text"
                                show="touched"
                                component="div"
                                messages={{
                                    required: "You must select an option"
                                }}
                            />
                        </div>
                        <div className="form-group">
                            <Label htmlFor="text" md={2}>Comments</Label>
                            <Control.textarea rows="6" model=".text" id="text" name="text"
                                placeholder="We'd love your thoughts"
                                className="form-control"
                                validators={{
                                    required,
                                    minLength: minLength(2),
                                }}
                            />
                            <Errors
                                className="text-danger"
                                model=".text"
                                show="touched"
                                component="div"
                                messages={{
                                    required: "Required",
                                    minLength: "Must be at least 2 characters",
                                }}
                            />
                        </div>
                        <Button type="submit" value="submit" color="primary">Submit</Button>
                    </LocalForm>
                </Modal>
            </React.Fragment>
        )
    }
}


function RenderCampsite({ campsite }) {

    return (
        <div className="col-md-5 m-1">
            <Card>
                <CardImg top src={baseUrl + campsite.image} alt={campsite.name} />
                <CardBody>
                    <CardText>{campsite.description}</CardText>
                </CardBody>
            </Card>
        </div>
    )
}

function RenderComments({comments, postComment, campsiteId }) {
    if (comments) {
        return (
            <div className="col-md-5 m-1">
                <h4>Comments</h4>
                {comments.map(comment =>
                    <div key={comment.id}>{comment.text}<br />
                        {comment.author} -- {new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: '2-digit' }).format(new Date(Date.parse(comment.date)))}
                        <br />
                        <br />
                    </div>
                )
                }
                <CommentForm campsiteId={campsiteId} postComment={postComment}/>
            </div>
        )
    }
    else {

        return (
            <div></div>
        )
    }
}

function CampsiteInfo(props) {
    if(props.isLoading){
        return(
            <div className="container">
                <div className="row">
                    <Loading />
                </div>
            </div>
        )
    }
    if(props.errMess){
        return(
            <div className="container">
                <div className="row">
                    <div className="col">
                        <h4>{props.errMess}</h4>
                    </div>
                </div>
            </div>
        )
    }
    if (props.campsite) {
        return (
            <div className="container">
                <div className="row">
                    <div className="col">
                        <Breadcrumb>
                            <BreadcrumbItem><Link to="/directory">Directory</Link></BreadcrumbItem>
                            <BreadcrumbItem active>{props.campsite.name}</BreadcrumbItem>
                        </Breadcrumb>
                        <h2>{props.campsite.name}</h2>
                        <hr />
                    </div>
                </div>
                <div className="row">
                    <RenderCampsite campsite={props.campsite} />
                    <RenderComments 
                    comments={props.comments}
                    postComment={props.postComment}
                    campsiteId={props.campsite.id}
                    />
                </div>
            </div>
        )
    }
    else {
        return <div />
    }
}

export default CampsiteInfo;