import axios from 'axios'

export function get(url, params) {
  return axios.get(url, {
    params
  }).then(res => {
    return res.data //把响应的data数据返回 
  }).catch(err => {
    console.log(err);
  })

}