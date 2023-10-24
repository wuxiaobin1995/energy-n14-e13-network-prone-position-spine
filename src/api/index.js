/*
 * @Author      : Mr.bin
 * @Date        : 2021-11-10 11:14:44
 * @LastEditTime: 2023-10-24 14:33:26
 * @Description : 封装axios
 */
import axios from 'axios'

const instance = axios.create({
  // baseURL: 'http://192.168.1.233/prone_position_spine_v3/public/index.php/api', // 本地
  baseURL: 'http://106.52.43.100/prone_position_spine_v3/public/index.php/api', // 云端
  timeout: 10000
})

export { instance }
