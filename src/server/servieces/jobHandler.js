const jobHandler = async(data)=>{
    console.log("JOBDATA =====",data);
    console.log(`job ${data.id} received with data:`);
    console.log(JSON.stringify(data.data));
    
}

module.exports = jobHandler;