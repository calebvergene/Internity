import { useState } from "react";

const ApplicationForm = () => {
    const [name, setName] = useState("")
    const [open, setOpen] = useState("")
    const [close, setClose] = useState("")
    const [link, setLink] = useState("")

    const onSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault()

        const data = {
            name,
            open, 
            close, 
            link
        }
        const url = "http://127.0.0.1:5000/create_application"
        const options = {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(data)
            }
        const response = await fetch(url, options)
        if (response.status !== 201 && response.status !== 200) {
            const data = await response.json()
            alert(data.message)
        } else {
            // need to edit
        }
    }
        return <form onSubmit={onSubmit}>
        <div className="text-black">
            <div>
                <label htmlFor="name">Name:</label>
                <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="open">Opens:</label>
                <input type="text" id="open" value={open} onChange={(e) => setOpen(e.target.value)} />
            </div>
            <div>
                <label htmlFor="close">Due:</label>
                <input type="text" id="close" value={close} onChange={(e) => setClose(e.target.value)} />
            </div>
            <div>
                <label htmlFor="link">Link:</label>
                <input type="text" id="link" value={link} onChange={(e) => setLink(e.target.value)} />
            </div>
        </div>
        <button type="submit">Create Application</button>
    </form>
    }


export default ApplicationForm