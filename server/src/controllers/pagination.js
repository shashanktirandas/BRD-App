
const pagination=(page,limit,total)=>{
    return {
        page,
        limit,
        total,
        totalPages:Math.ceil(total/limit),
        hasNextPage:page<Math.ceil(total/limit),
        hasPreviousPage:page>1
    }
}
module.exports=pagination;