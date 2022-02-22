/*import React, { Component } from 'react';
import firebase from '../../config/firebase';
import { Link } from 'react-router-dom';

// Class components :(

class Edit extends Component {

    constructor(props) {
        super(props);
        this.state = {
            key: '',
            name: '',
            location: '',
            createdAt: '',
            lastEditedAt: ''
        };
    }

    componentDidMount() {
        const ref = firebase.firestore().collection('sheets').doc(this.props.match.params.id);
        ref.get().then((doc) => {
            if (doc.exists) {
                const sheet = doc.data();
                this.setState({
                    key: doc.id,
                    name: sheet.name,
                    location: sheet.location
                });
            } else {
                console.log("No such document!");
            }
        });
    }

    onChange = (e) => {
        const state = this.state
        state[e.target.name] = e.target.value;
        this.setState({ sheet: state });
    }

    onSubmit = (e) => {
        e.preventDefault();

        const { name, location } = this.state;

        const updateRef = firebase.firestore().collection('sheets').doc(this.state.key);
        updateRef.set({
            name,
            location,
            createdAt,
            lastEditedAt
        }).then((docRef) => {
            this.setState({
                key: '',
                name: '',
                location: '',
                createdAt: '',
                lastEditedAt: ''
            });
            this.props.history.push("/show/" + this.props.match.params.id)
        })
            .catch((error) => {
                console.error("Error adding document: ", error);
            });
    }

    render() {
        return (
            <div class="container">
                <div class="panel panel-default">
                    <div class="panel-heading">
                        <h3 class="panel-title">
                            EDIT BOARD
                        </h3>
                    </div>
                    <div class="panel-body">
                        <h4><Link to={`/show/${this.state.key}`} class="btn btn-primary">Board List</Link></h4>
                        <form onSubmit={this.onSubmit}>
                            <div class="form-group">
                                <label for="name">Name:</label>
                                <input type="text" class="form-control" name="name" value={this.state.name} onChange={this.onChange} placeholder="name" />
                            </div>
                            <div class="form-group">
                                <label for="location">Description:</label>
                                <input type="text" class="form-control" name="location" value={this.state.location} onChange={this.onChange} placeholder="location" />
                            </div>
                            <button type="submit" class="btn btn-success">Submit</button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

export default Edit;*/