const toastMessage = ({color,msg})=>{
    return (
        <>
        <div className="Toast" style={{background:color}}>
            <p>{msg}</p>
        </div>
        </>
    )
}

export {toastMessage}