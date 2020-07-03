
import axios from 'axios'
const api = axios.create({
    baseURL: `http://ec2-52-3-255-170.compute-1.amazonaws.com:3000/api`
})

export const patientReducer = (state, action) => {
    switch(action.type){
        case 'GET_NUM_METRICS':
            return {...state, num_metrics: action.count}
            
        case 'GET_NUM_SYMPTOMS':
            return {...state, num_symptoms: action.count}
            
        case 'GET_NUM_DIAGNOSTICS':
            return {...state, num_diagnostics: action.count}
        default:
            return state;
    }
}