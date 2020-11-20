import React from 'react'

import PropTypes from 'prop-types'

import {connect} from 'react-redux'
import {registeruser} from '../../action/authAction'
import {withRouter} from 'react-router-dom'
import TextFieldGroup from '../common/TextFieldGroup'

class Register extends React.Component{
    constructor(props){
        super(props)
        this.state={
            name:'',
            email:'',
            password:'',
            password2:'',
            errors:{}
        }
    }
    componentDidMount(){
      if(this.props.auth.isAuthenticated){
        this.props.history.push('/dashboard')
      }
    }
    componentWillReceiveProps(nextProps){
      if(nextProps.errors){
        this.setState({errors:nextProps.errors})
      }
    }
    onChange=(e)=>{
        this.setState({[e.target.name]:e.target.value})
    }
    onSubmit=(e)=>{
        e.preventDefault()
        const formData={
            name:this.state.name,
            email:this.state.email,
            password:this.state.password,
            password2:this.state.password2
        }
        console.log(formData)
        this.props.registeruser(formData,this.props.history)
       
    }
    render(){
        const {errors} =this.state;
         
        return(
            <div className="register">
            
            <div className="container">
              <div className="row">
                <div className="col-md-8 m-auto">
                  <h1 className="display-4 text-center">Sign Up</h1>
                  <p className="lead text-center">Create your DevConnector account</p>

                  <form noValidate onSubmit={this.onSubmit}>
                  <TextFieldGroup
                    type="name" 
                    placeholder="Name" 
                    name="name"
                    value={this.state.name} 
                    onChange={this.onChange}
                    error={errors.name}
                   />
                 <TextFieldGroup
                         type="email" 
                         placeholder="Email Address" 
                         name="email" 
                         value={this.state.email}
                         onChange={this.onChange}
                         error={errors.email}
                         info="This site uses Gravatar so if you want a profile image use a Gravator email"
                    />
                    <TextFieldGroup
                    type="password" 
                    placeholder="Password" 
                    name="password"
                    value={this.state.password} 
                    onChange={this.onChange}
                    error={errors.password}
                   />
                    
                    <TextFieldGroup
                    type="password" 
                    placeholder="Confirm Password" 
                    name="password2"
                    value={this.state.password2} 
                    onChange={this.onChange}
                    error={errors.password2}
                   />
                    <input type="submit" className="btn btn-info btn-block mt-4" />
                  </form>
                </div>
              </div>
            </div>
          </div>
        )
    }
}
Register.propTypes={
  registeruser:PropTypes.func.isRequired,
  auth:PropTypes.object.isRequired,
  errors:PropTypes.object.isRequired
}
const mapStateToProps=(state)=>({
  auth:state.auth,
  errors:state.errors
})
export default connect(mapStateToProps,{registeruser})(withRouter(Register))