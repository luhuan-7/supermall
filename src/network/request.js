import axios from 'axios'

//创建实例
export function request(config) {
    const instance = axios.create({
      baseURL:'http://123.207.32.32:8000/api/wh',
      timeout:5000
    })

    //axios的拦截器
  instance.interceptors.request.use(config=>{
    return config
  },err=>{
    // console.log(err);
  });

//响应拦截
  instance.interceptors.response.use(res=>{
    // console.log(res);
    return res.data
  },err=>{
    console.log(err);
  })
    //发送真正的网络请求(这里返回的是promise，所以请求的时候.then（）)
    return instance(config)
}

