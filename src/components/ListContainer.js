import React, { Component } from 'react';
import axios from 'axios';
import ListItem from './ListItem';
import Cookies from 'js-cookie';
import './components.css';
import * as firebase from "firebase";

class ListContainer extends Component {

    state = {
        skillTagList : {},
        skillTagListLoaded: false,
        skillPriorityListLoaded: false,
        skillPriorityList: {}
    };

    constructor(){
        // Initialize the 'this'
        super();

        // configure firebase
        const config = {
            apiKey: "AIzaSyBOAOEmFnIT5XdKgWXlvOFz5U-IUjhQeWA",
            authDomain: "multi-column-sortable-tag-list.firebaseapp.com",
            databaseURL: "https://multi-column-sortable-tag-list.firebaseio.com",
            projectId: "multi-column-sortable-tag-list",
            storageBucket: "multi-column-sortable-tag-list.appspot.com",
            messagingSenderId: "512587231011"
          };
        if (!firebase.apps.length) {
            firebase.initializeApp(config);
        }

    }

    // get the list of the tags available on stackoverflow
    getSkillTagList() {
        axios.get("https://api.stackexchange.com/2.2/tags?order=desc&sort=popular&site=stackoverflow&filter=!-.G.68gzI8DP").then(response => {
            this.setState({
            skillTagList: response.data.items,
            skillTagListLoaded: true
            });
        }).catch(error => this.setState({ error, skillTagListLoaded: false }));
    }

    // get the priority list of existing user
    getSkillPriorityList() {
        const username = Cookies.get('username');
        //synchrounous call to firebase then render the page
        firebase.database().ref('/items').on("value", (snapshot) => {
            this.setState(
                {
                    skillPriorityList: [snapshot.val()[username]][0],
                    skillPriorityListLoaded: true
                }
            );
            //console.log(this.state.skillPriorityList)
         }, (error) => {
            this.setState({ error, skillTagListLoaded: false })
         });
    }

    updateSkillPriorityList(deletedSkillIndex) {
        // rearrange the priority list
        // set the state of priority list
        var updatedSkillPriorityList = {};

        // console.log(deletedPriorityValue);
        // console.log(this.state.skillPriorityList);
        var numberOfSkills = this.state.skillPriorityList.length;
        var temp = ["undefined"];
        for(var x=1; x < (numberOfSkills-1); x++){
            if(x >= deletedSkillIndex){
                updatedSkillPriorityList[x] = this.state.skillPriorityList[x+1];
                temp.push(this.state.skillPriorityList[x+1])
            }
            else{
                updatedSkillPriorityList[x] = this.state.skillPriorityList[x];
                temp.push(this.state.skillPriorityList[x])
            }
        }
        
        this.setState({
            skillPriorityList: [temp]
        });
        

        // update the firebase
        const username = Cookies.get('username');
        firebase.database().ref('/items').update({
            [username]: updatedSkillPriorityList
        });
    }

    componentWillMount(){
        if(typeof Cookies.get('username') === 'undefined')    
            Cookies.set('username', this.makeId());

        this.getSkillPriorityList();
        this.getSkillTagList();
    }

    // generate random id
    makeId() {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      
        for (var i = 0; i < 5; i++)
          text += possible.charAt(Math.floor(Math.random() * possible.length));
      
        return text;
    }

    isSkillPresent(skill) {
        if(typeof this.state.skillPriorityList !== 'undefined')
            return this.state.skillPriorityList.some(item => skill === item);
        else
            return false;
    }


    render() {
        var skillList = [];

        if(this.state.skillTagListLoaded === true && this.state.skillPriorityListLoaded === true){
            // for loop to iterate over the tag list to ListItem if the value and priority is empty

            //console.log(this.state.skillPriorityList[1]);
            for(var x in this.state.skillTagList){
                var skill = this.state.skillTagList[x].name;
                skill = skill.charAt(0).toUpperCase()+ skill.slice(1);

                if(!this.isSkillPresent(skill))
                    skillList.push({
                            value: skill,
                            label: skill
                        });
            }
                
            // console.log(skillList);
            // for now assume that there are only two columns and 8 skills to fill.
            // for loop to create the dynamic list using the skillPriorityList if there is no skill 
            // left then fill the rest of the rows with blank values.
            var columnOne = [];
            var columnTwo = [];
            var skillLength = 0;

            if(typeof this.state.skillPriorityList !== 'undefined')
                skillLength = this.state.skillPriorityList.length-1; // due to extra value from firebase

            //console.log(this.state.skillPriorityList);

            for(x = 1; x<=10; x++){
                if(x < 6){
                    if(x <= skillLength)
                        columnOne.push(<ListItem type="filledInput" skill={this.state.skillPriorityList[x]} priority={x} onDelete={this.updateSkillPriorityList.bind(this)}/>);
                    else if(x <= skillLength+1)
                        columnOne.push(<ListItem type="activeInput" priority={x} skillList={skillList} placeholder={x+". Add Item"}/>);
                    else
                        columnOne.push(<ListItem type="inactiveInput" priority={x} placeholder={x+". Add Item"}/>);
                }
                else{
                    if(x <= skillLength)
                        columnTwo.push(<ListItem type="filledInput" skill={this.state.skillPriorityList[x]} priority={x} onDelete={this.updateSkillPriorityList.bind(this)}/>);
                    else if(x <= skillLength+1)
                        columnTwo.push(<ListItem type="activeInput" priority={x} skillList={skillList} placeholder={x+". Add Item"}/>);
                    else
                        columnTwo.push(<ListItem type="inactiveInput" priority={x} placeholder={x+". Add Item"}/>);
                }
            }

            //console.log(columnOne);

            return(
                <div>
                    <ul type="none" className="listColumn">
                        {columnOne}
                    </ul>
                    <ul type="none" className="listColumn">
                        {columnTwo}
                    </ul>
                </div>
            );
        }
        else
            return(<div>Loading...</div>)
    }
}

export default ListContainer;