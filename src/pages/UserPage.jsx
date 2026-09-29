import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import background from './images/background-2.jpg'
import defaultAvatar from './images/defaultAvatar.jpg'
import { Container } from "react-bootstrap";
import { Card, Button } from "react-bootstrap";
import { ListGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function UserPage() {
    const { userInfo } = useContext(AuthContext)
    const id = userInfo?.id
    const navigate = useNavigate()

    const goEdit = () => {
        navigate('/setProfile')
    }


    return (
        <>
            <Container fluid className="vh-100" style={{ textAlign: 'center', display: 'flex', flexDirection: "column", backgroundImage: `linear-gradient(rgba(244, 235, 217, 0.5), rgba(244, 235, 217, 0.7)),url(${background})`, alignItems: 'center', justifyContent: "center" }}>
                <h2 className="mb-4 fw-bold" style={{ color: "#8C7352" }}>
                    Profile
                </h2>
                <Card style={{ fontFamily: "cursive" }}>
                    <Card.Img
                        variant="top"
                        src={userInfo?.image_url || defaultAvatar}
                        onError={(e) => {
                            e.target.onerror = null
                            e.target.src = defaultAvatar
                        }}
                        style={{ height: "300px", }}
                    />
                    <Card.Body style={{ backgroundColor: "#F9F6F0" }} >
                        <Card.Title>{userInfo?.name}</Card.Title>
                        {userInfo?.introduction && (
                            <Card.Text>
                                {userInfo.introduction}
                            </Card.Text>
                        )}
                    </Card.Body>
                    <div style={{ backgroundColor: "#F9F6F0" }}>
                        <p>Email: {userInfo?.email}</p>
                        <p>Occupation: {userInfo?.occupation}</p>
                        <p>Introduction: {userInfo?.introduction}</p>
                        <Button onClick={() => goEdit()} style={{ border: "0px", width: "50%", marginBottom: "20px", backgroundColor: "#B29A78" }}>Change Profile</Button>
                    </div>
                </Card>
            </Container>
        </>
    )

}