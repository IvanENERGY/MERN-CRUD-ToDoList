
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import {useForm} from "react-hook-form"
// import * as yup from 'yup'
// import {yupResolver} from '@hookform/resolvers/yup'
import { useContext, useEffect, useState } from 'react';
import { ITaskData } from '../interface/ITaskData';
import { UserContext } from '../App';


export const UpdateTask=()=>{
    
    const {id}=useParams();
    const [isLoading,setLoading]=useState(true);
    const [name,setName]=useState("");
    const [deadline,setDeadline]=useState("");
    const [reps,setReps]=useState(-1);

    const [errors,setErrors]=useState({
        name:"",
        deadline:"",
        reps:""
    });
    const [userContext,setUserContext] = useContext(UserContext);
    const navigate  =useNavigate();

    function formatDate(inputDate:string) {
        // Parse the input date
        var date = new Date(inputDate);
        // Extract date components
        var year = date.getFullYear();
        var month = ("0" + (date.getMonth() + 1)).slice(-2); // Adding leading zero if needed
        var day = ("0" + date.getDate()).slice(-2); // Adding leading zero if needed
        var hours = ("0" + date.getHours()).slice(-2); // Adding leading zero if needed
        var minutes = ("0" + date.getMinutes()).slice(-2); // Adding leading zero if needed
      
        // Construct the formatted date string
        var formattedDate = year + "-" + month + "-" + day + "T" + hours + ":" + minutes;   
        return formattedDate;
    }
    //Retreive the original value for the task
    useEffect(()=>{
        // axios.get(`http://localhost:3000/api/tasks/${id}`)
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/tasks/${id}`,{headers:{'token':userContext.token}})
        .then((response:any)=>{
            setName(response.data.data.name);
            console.log("retreivefromdbis"+response.data.data.deadline);
            setDeadline(formatDate(new Date(response.data.data.deadline).toString()));
            console.log("Displaying"+formatDate(new Date(response.data.data.deadline).toString()));
            setReps(response.data.data.reps);
            setLoading(false);
        })
    },[])
 
    const validateForm=()=>{
        var valid=true;
        const errorsCopy={...errors};
        if(!name.trim()){
            errorsCopy.name="Task name must be entered";
            valid=false;
        }else{
            errorsCopy.name="";
        }

        if(!deadline.trim()){
            errorsCopy.deadline="Deadline must be entered";
            valid=false;
        }else if (Date.parse(deadline)<=Date.parse(new Date().toString())){
            errorsCopy.deadline="Deadline must be later than current datetime";
            valid=false;
        }else{
            errorsCopy.deadline="";
        }
        
        if(!reps.toString().trim()){
            errorsCopy.reps="Reps must be entered";
            valid=false;
        }else if (reps<0){
            errorsCopy.reps="Reps must be larger or equal to 0";
            valid=false;
        }else{
            errorsCopy.reps="";
        }
        setErrors(errorsCopy);
        return valid;
    }

    const mySubmitHandler=(event:any)=>{
        event.preventDefault();
        //object {name:...,deadline:...,reps,...}
        if(validateForm()){
            console.log("push to db is "+deadline);
            let data={
                name,
                deadline,
                reps
            }
            // axios.put(`http://localhost:3000/api/tasks/${id}/update`,data)
            axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/tasks/${id}/update`,data,{headers:{'token':userContext.token}})
            .then((result)=>{
                navigate("/tasks");
            })
            .catch((err)=>{
                alert(`Some error happen: ${err}`)  ;  
            })
        }
    }

    return(
        <>
        <h1>UpdateTask Page</h1>
        
        {isLoading ?(<h1 style={{backgroundColor:"red"}}>Loading...</h1>):(
        <fieldset>
            <legend>
                Update an Existing Task [Id:{id}]
            </legend>
            <form onSubmit={mySubmitHandler}>
                <input type="text" onChange={(event)=>{setName(event.target.value)}}  placeholder="Enter Task Name..." value={name} required/>
                {errors.name && <p style={{color:"red"}}>{errors.name }</p>}

                <input type="datetime-local" onChange={(event)=>{setDeadline(event.target.value)}} placeholder="Enter Deadline..." value={deadline}  required />
                {errors.deadline && <p style={{color:"red"}}>{errors.deadline }</p>}

                <input type="number"onChange={(event)=>{setReps(parseInt(event.target.value))}} placeholder="Enter Reps..." value={reps} required />
                {errors.reps && <p style={{color:"red"}}>{errors.reps }</p>}

                <input type="submit" value="Press Submit"/>
            </form>
        </fieldset>
        )}
        </>
    )
}