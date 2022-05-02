import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import axios from 'axios';
import Button from '../../components/Button';
import { trimmed } from '../../helpers';
import InputTextField from '../../components/InputText';
import './ZonesPage.css'

const ZonesPage = (props) => {
    const [zone, setZone] = useState({
        route: "",
        zoneName: '',
    });

    const [routes, setRoutes] = useState([]);
    const [error, setError] = useState('');
    const handleChange = ({ target }) => {
        const { name, value } = target;
    
        if (error) {
          setError('');
        }
    
        setZone({
          ...zone,
          [name]: value
        });
    };
    useEffect(() => {
        // remove the current state from local storage
        // so that when a person logs in they dont encounter
        // the previous state which wasnt cleared
        axios.get(`/api/routes`)
        .then((res) =>{
            setRoutes( res.data );
        })
        .catch(err => {
            console.log(err)
        })
    }, []);

    const submit = () => {
        const { route, zoneName } = zone;
        console.log(zone);
        if (!route){ 
            setError('Route is required');
            return;
        }
        if (!zoneName){ 
            setError('Zone name is required');
            return;
        }
        //* Trim user details
        const zoneInfo = {
          name: zoneName.trim(),
          route: route.trim()
        }
        
        axios.post('http://localhost:5000/api/zones', zoneInfo)             //!   Needs to be changed
        .then(res => {
            // save user data to store
            // add access token to localstorage
            console.log("here", res)
            if(res.data.code === 200){
                window.location.href = "/admin";
            }else{
                setError(res.data.message);
            }
          })
          .catch((err) => {
            setError('Failed to add zone.');
            console.log(err);
        });
    };
    
    return(        
        <div className="Page">
            <div className="Form">
                <div className="FormTitle">Add Zone</div>
                <select  
                    required
                    type="text"
                    name="route"
                    value={zone.route}
                    placeholder="Route"
                    onChange={handleChange}
                    className='InputTextField'
                >
                    <option value={""}>--Route--</option>
                    { routes.map((item)=> (
                        <option value={item._id} key={item._id} >{item.name}</option>
                    ))}
                </select>
        
                <InputTextField
                    required
                    type="text"
                    name="zoneName"
                    value={zone.zoneName}
                    placeholder="Zone Name"
                    onChange={handleChange}
                />
        
                {error && (
                    <div className="Error">
                    {error}
                    </div>
                )}
        
                <Button
                    label="ADD ZONE"
                    onClick={submit}
                />
            </div>
        </div>
    )

}
export default connect(  )(withRouter(ZonesPage));