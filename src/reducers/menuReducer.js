
import axios from 'axios'
const api = axios.create({
    baseURL: `http://ec2-52-3-255-170.compute-1.amazonaws.com:3000/api`
})

export const menuReducer = (state, action) => {
    switch(action.type){
        case 'GET_NUM_DOCTORS':
            api.get("/healthworkers/number", action.token)
                .then(res => {
                    state.num_doctors = res.data.count
                    return state
                })
                .catch(error=> {
                    state.num_doctors = 0
                    return state
                })
        case 'GET_NUM_PATIENTS':
            api.get("/patients/number")
                .then(res => {
                    state.num_patients = res.data.count
                    return state
                })
                .catch(error=> {
                    state.num_patients = 0
                    return state
                })
        default:
            return state;
    }
}