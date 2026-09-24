import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import background from './images/background-2.jpg'
import { Container } from "react-bootstrap";
import { Card } from "react-bootstrap";
import { ListGroup } from "react-bootstrap";

export default function UserPage() {
    const { userInfo } = useContext(AuthContext)
    const id = userInfo?.id

    return (
        <>
            <Container fluid className="vh-100" style={{ display: 'flex', flexDirection: "column", backgroundImage: `linear-gradient(rgba(244, 235, 217, 0.5), rgba(244, 235, 217, 0.7)),url(${background})`, alignItems: 'center', justifyContent: "center" }}>
                <h2 className="mb-4 text-dark fw-bold">
                    Introduction
                </h2>
                <Card style={{ height: "50%" }}>
                    <Card.Img variant="top" src={`${userInfo?.image_url}`} />
                    <Card.Body>
                        <Card.Title>{userInfo?.name}</Card.Title>
                        {userInfo?.introduction && (
                            <Card.Text>
                                {userInfo.introduction}
                            </Card.Text>
                        )}
                    </Card.Body>
                    <ListGroup>
                        <ListGroup.Item>Email: {userInfo.email}</ListGroup.Item>
                        <ListGroup.Item>Occupation: {userInfo.occupation}</ListGroup.Item>
                    </ListGroup>
                </Card>
            </Container>
        </>
    )

}