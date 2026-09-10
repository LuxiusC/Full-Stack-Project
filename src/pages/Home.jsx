import { Image, Container, Row, Col, Button } from "react-bootstrap"
import { Nav, Navbar } from "react-bootstrap"
import { Carousel } from "react-bootstrap"
import icon from "./images/icon.png"
import food1 from './images/food1.jpg'
import food2 from './images/food2.jpg'
import food3 from './images/food3.jpg'
import background from './images/background-2.jpg'

export default function Home() {
    return (
        <Container fluid
            className="p-0"
            style={{
                backgroundColor: "#E8DDD5",
                backgroundImage: `linear-gradient(rgba(244, 235, 217, 0.85), rgba(244, 235, 217, 0.85)),url(${background})`,
                minHeight: "800px",
            }}>
            <Navbar expand="md" style={{ backgroundColor: "#F9F8F3" }}>
                <Container className="d-flex" style={{ paddingLeft: "70px", paddingRight: "70px", justifyContent: "space-between" }}>
                    <Navbar.Brand><Image src={icon} height="80" width="140" /></Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ms-auto">
                            <Nav.Link>Home</Nav.Link>
                            <Nav.Link>About us</Nav.Link>
                            <Nav.Link>Careers</Nav.Link>
                            <Nav.Link>Login/Register</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <Container fluid className="d-flex justify-content-center" style={{ backgroundColor: "#F9F8F3" }} >
                <Carousel style={{ maxWidth: "850px", maxHeight: "550px", padding: "0px" }}>
                    <Carousel.Item>
                        <Image src={food1}
                            style={{ width: "100%", height: "100%", objectFit: "contain" }}
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
            <Row className="d-flex justify-content-center " >
                <Col
                    style={{

                        backgroundColor: "#F5F0EB",
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
                        backgroundColor: "#F5F0EB",
                        borderRadius: "8px",
                        padding: "20px",
                        fontFamily: "Arial",
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "column"
                    }}
                >
                    <p className="text-center" style={{ fontWeight: "600" }}>20% off your first meal if you register with us right now! :</p>
                    <Button>Register</Button>
                </Col>
            </Row>
        </Container>
    )
}