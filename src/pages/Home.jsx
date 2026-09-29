import { Image, Container, Row, Col, Button } from "react-bootstrap"
import { Nav, Navbar } from "react-bootstrap"
import { Carousel } from "react-bootstrap"
import icon from "./images/icon.png"
import food1 from './images/food1.jpg'
import food2 from './images/food2.jpg'
import food3 from './images/food3.jpg'
import { AuthContext } from "../contexts/AuthContext"
import { useContext } from "react"
import { useNavigate } from "react-router-dom"

export default function Home() {
    const navigate = useNavigate()
    const { url, user } = useContext(AuthContext)

    const ifLogin = () => {
        if (user) {
            navigate('/marketplace')
        } else {
            navigate('/login')
        }
    }

    return (
        <Container fluid
            className="min-vh-100 p-0 m-0 d-flex flex-column justify-content-between"
            style={{
                backgroundColor: "#F9F8F3",

            }}>
            <Navbar expand="md" style={{ backgroundColor: "#F9F8F3" }}>
                <Container className="d-flex" style={{ paddingLeft: "70px", paddingRight: "70px" }}>
                    <Navbar.Brand><Image src={icon} height="80" width="140" /></Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ms-auto">
                            <Nav.Link>Home</Nav.Link>
                            <Nav.Link href="/recipes">Recipes</Nav.Link>
                            <Nav.Link onClick={() => ifLogin()}>Marketplace</Nav.Link>
                            <Nav.Link href="/login">Login/Register</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <Container fluid className="d-flex justify-content-center" style={{ backgroundColor: "#F9F8F3" }} >
                <Carousel style={{ maxWidth: "850px", maxHeight: "550px" }}>
                    <Carousel.Item>
                        <Image src={food1}
                            style={{ width: "100%", height: "100%" }}
                        />
                    </Carousel.Item>
                    <Carousel.Item>
                        <Image src={food2}
                            style={{ width: "100%", height: "100%", objectFit: "contain" }}
                        />
                    </Carousel.Item>
                    <Carousel.Item>
                        <Image src={food3}
                            style={{ width: "100%", height: "100%", objectFit: "contain" }}
                        />
                    </Carousel.Item>
                </Carousel>
            </Container>
            <Row className="d-flex justify-content-center align-items-center mx-0" >
                <Col
                    style={{

                        backgroundColor: "#F9F8F3",
                        borderRadius: "8px",
                        padding: "20px"

                    }}
                    className="text-center"
                >
                    <h5 style={{ fontWeight: "600", marginBottom: "8px", fontFamily: "Bradley Hand" }}> Discover , Choose , Enjoy </h5>
                    <p className="m-0">
                        All it takes to enjoy a hearty and warm meal from a neighborhood masterchef.
                    </p>
                </Col>
                <Col
                    style={{
                        display: "flex",
                        backgroundColor: "#F9F8F3",
                        borderRadius: "8px",
                        padding: "20px",
                        fontFamily: "Arial",
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "column"
                    }}
                >
                    <p className="text-center" style={{ fontWeight: "600" }}>20% off your first meal if you register with us right now! :</p>
                    <Button onClick={() => navigate("/login")}>Register</Button>
                </Col>
            </Row>
            <hr style={{ color: "#B29A78", borderWidth: "3px" }} />
            <div style={{ display: 'flex', alignItems: "center", justifyContent: "center" }}>

                <a className="me-2" style={{ color: "#B29A78" }} href=""><i class="bi bi-twitter-x"></i>  </a>
                <a className="me-2" style={{ color: "#B29A78" }} href=""><i class="bi bi-facebook"></i></a>
                <a className="me-2" style={{ color: "#B29A78" }} href=""><i class="bi bi-instagram"></i></a>
            </div>
            <p style={{ backgroundColor: "#F9F8F3", color: "#B29A78", display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: "10px" }}><i class="bi bi-c-circle"></i> 2024 CASARIA. All Rights reserved.</p>
        </Container>
    )
}