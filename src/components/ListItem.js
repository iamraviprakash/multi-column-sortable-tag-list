import React, { Component } from 'react';
//import Draggable from 'react-draggable';
import Select from 'react-select';
import './components.css';
import Cookies from 'js-cookie';
import * as firebase from "firebase";

// converting it in a class
// if a skill is selected it will be updated in firebase
// and Draggable li will be rendered


// tasks
// send all inline css below to ./components.css
class ListItem extends Component{

  state = {
    selectedOption: null,
  }

  handleChange = (selectedOption) => {
    this.setState({ selectedOption });
    
    var string = selectedOption.value;

    const username = Cookies.get('username');
    firebase.database().ref('/items/'+username).update({
          [this.props.priority]: string
    });
  }

  deleteSkill = (e) => {
    e.preventDefault();
    this.setState({ selectedOption: null });
    this.props.onDelete(this.props.priority);
  }

  render() {

    const { selectedOption } = this.state;
    var skill = "";

    if(this.props.type === "activeInput" && selectedOption === null) {
      
      return (
        <li> 
          <Select className='dropdownStyle' value={selectedOption} onChange={this.handleChange} options={this.props.skillList} placeholder={this.props.placeholder}/>
        </li>
      );
    }
    else if( this.props.type === "filledInput"){

      if(selectedOption !== null)
        skill = selectedOption.value;
      else
        skill = this.props.skill;

      return (
            <li className='containerStyleExist'>
              <div className='textContainer'>
                <span className='textStyle'>{this.props.priority}.</span>
                <span className='textStyle'>{skill}</span>
              </div>
              <button className='crossIconStyle' onClick={this.deleteSkill}>x</button>
            </li>
      );
    }
    else {
      return (
        <li> 
          <Select isDisabled className='dropdownStyle' value={selectedOption} options={this.props.skillList} placeholder={this.props.placeholder}/>
        </li>
      );
    }
    
  }

} 

export default ListItem;