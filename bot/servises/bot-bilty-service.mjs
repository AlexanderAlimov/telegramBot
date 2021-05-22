import axios from 'axios'
import Config from "../../config/config.mjs"

const config = new Config();

class BotBitlyService {
    async shortUrl(url){
        let message = ''
        const urlLink = `${config.getBitlyConfigObj().bitlyUrl}/v4/shorten`
        const domain = config.getBitlyConfigObj().bitlyDomain
        const data = { long_url: `${url}`, domain }
        const token = config.getBitlyConfigObj().token
        const options = {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
        try{
           const response = await axios.post(urlLink ,data , options)
           return message = `here is your short link ${response.data.link}`
        }catch(error){
          console.log(error)
          return message = 'something went wrong (:'
        }
    }
}

export default BotBitlyService