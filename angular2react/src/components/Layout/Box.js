export default function Box(props) { 
    return <div className={`${props.className}`}>
        {props.children}
    </div>
}