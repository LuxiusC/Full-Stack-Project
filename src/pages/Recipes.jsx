import { useState, useEffect, useContext } from "react";
import {
    ButtonGroup, Col, Row, Image, Form, Card, Button,
    Container, Navbar, Offcanvas
} from "react-bootstrap";
import icon from './images/icon.png';
import background from './images/background-2.jpg';
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

export default function Recipes() {
    const { userInfo, handleLogout } = useContext(AuthContext);
    const [activeCategories, setActiveCategories] = useState([]);
    const [categoryNames, setCategoryNames] = useState([]);
    const [meals, setMeals] = useState([]);
    const [searchValue, setSearchValue] = useState('');

    // Mobile Drawer State
    const [showSidebar, setShowSidebar] = useState(false);

    const navigate = useNavigate();

    const handleCloseSidebar = () => setShowSidebar(false);
    const handleShowSidebar = () => setShowSidebar(true);

    const userLogout = async () => {
        try {
            await handleLogout();
            navigate('/login');
        } catch (err) {
            console.error(err, err.message);
        }
    };

    const handleMealInstruction = (mealId) => {
        navigate(`/mealDetails/${mealId}`);
    };

    // Fetch category names on mount
    useEffect(() => {
        fetch('https://www.themealdb.com/api/json/v1/1/list.php?c=list')
            .then((res) => res.json())
            .then((data) => setCategoryNames(data.meals || []))
            .catch((err) => console.error("Error fetching categories:", err));
    }, []);

    // Fetch meals when active categories change
    useEffect(() => {
        if (activeCategories.length === 0) {
            setMeals([]);
            return;
        }

        const categoryPromises = activeCategories.map((category) =>
            fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`)
                .then((res) => res.json())
                .then((data) => data.meals || [])
        );

        Promise.all(categoryPromises)
            .then((results) => {
                const combinedArray = results.flat();
                setMeals(combinedArray);
            })
            .catch((err) => console.error("Error fetching meals:", err));
    }, [activeCategories]);

    const filteredMeals = meals.filter((meal) =>
        meal.strMeal.toLowerCase().includes(searchValue.toLowerCase())
    );

    // Shared Sidebar Content Component
    const SidebarContent = () => (
        <div className="d-flex flex-column h-100 py-3 px-3">
            <div className="text-center mb-3">
                <Image src={icon} alt="Logo" style={{ maxHeight: "60px", maxWidth: "100%" }} />
            </div>

            {userInfo && (
                <div className="text-center mb-3">
                    <p className="fw-semibold mb-2">Welcome, {userInfo.name}</p>
                    <ButtonGroup className="p-1 bg-light rounded-pill border w-100">
                        <Button
                            onClick={() => navigate("/favourites")}
                            style={{ color: "#000000", border: "0px" }}
                            className="rounded-pill bg-light btn-sm w-50"
                        >
                            Favourites
                        </Button>
                        <Button
                            onClick={() => navigate("/marketplace")}
                            style={{ color: "#000000", border: "0px" }}
                            className="rounded-pill bg-light btn-sm w-50"
                        >
                            Marketplace
                        </Button>
                    </ButtonGroup>
                    <hr className="my-3" />
                </div>
            )}

            <div className="px-2 mb-4">
                <div style={{ fontSize: "18px", fontFamily: "cursive", fontWeight: 'bold' }} className="text-center mb-2">
                    Filter:
                </div>
                <div style={{ maxHeight: "300px", overflowY: "auto" }}>
                    {categoryNames.map((category) => {
                        const catName = category.strCategory;
                        return (
                            <Form.Check
                                key={catName}
                                type="switch"
                                id={`cat-${catName}`}
                                value={catName}
                                label={catName}
                                className="mb-2"
                                checked={activeCategories.includes(catName)}
                                onChange={(e) => {
                                    const { value, checked } = e.target;
                                    setActiveCategories(
                                        checked
                                            ? [...activeCategories, value]
                                            : activeCategories.filter((cat) => cat !== value)
                                    );
                                }}
                            />
                        );
                    })}
                </div>
            </div>

            <div className="mt-auto text-center pt-3 border-top">
                <Button variant="danger" onClick={userLogout} className="w-100 rounded-3">
                    Logout
                </Button>
            </div>
        </div>
    );

    return (
        <div
            className="min-vh-100"
            style={{
                backgroundImage: `linear-gradient(rgba(244, 235, 217, 0.65), rgba(244, 235, 217, 0.6)), url(${background})`,
                backgroundSize: "cover",
                backgroundAttachment: "fixed"
            }}
        >
            {/* MOBILE TOP NAVBAR (Visible on screens < md) */}
            <Navbar expand="md" className="d-md-none bg-white shadow-sm sticky-top px-3">
                <Container fluid className="p-0">
                    <Button variant="outline-dark" onClick={handleShowSidebar} className="border-0 p-1">
                        ☰ Filter Menu
                    </Button>
                    <Navbar.Brand onClick={() => navigate("/")} className="m-0">
                        <Image src={icon} style={{ height: "35px" }} />
                    </Navbar.Brand>
                    <div
                        style={{
                            width: "36px",
                            height: "36px",
                            borderRadius: "50%",
                            overflow: "hidden",
                            cursor: "pointer"
                        }}
                        onClick={() => navigate("/userpage")}
                    >
                        <Image
                            src={userInfo?.image_url}
                            alt="User profile"
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                    </div>
                </Container>
            </Navbar>

            {/* MOBILE DRAWER (Offcanvas) */}
            <Offcanvas show={showSidebar} onHide={handleCloseSidebar} placement="start" className="d-md-none">
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Menu & Filters</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body className="p-0">
                    <SidebarContent />
                </Offcanvas.Body>
            </Offcanvas>

            <Container fluid className="p-0">
                <Row className="g-0">
                    {/* DESKTOP FIXED SIDEBAR (Hidden on screens < md) */}
                    <Col md={3} lg={2} className="d-none d-md-block vh-100 position-sticky top-0 bg-white shadow-sm border-end">
                        <SidebarContent />
                    </Col>

                    {/* MAIN CONTENT AREA */}
                    <Col xs={12} md={9} lg={10} className="p-3 p-md-4">

                        {/* SEARCH HEADER */}
                        <Row className="mb-4 justify-content-center">
                            <Col xs={12} sm={8} md={6} lg={5} className="d-flex align-items-center gap-2">
                                <Form.Control
                                    type="search"
                                    placeholder="Search recipes..."
                                    value={searchValue}
                                    onChange={(e) => setSearchValue(e.target.value)}
                                    style={{
                                        boxShadow: "none",
                                        border: "2px solid #2e7d32",
                                        borderRadius: "20px",
                                        padding: "6px 15px"
                                    }}
                                />
                                <div
                                    className="d-none d-md-block flex-shrink-0"
                                    style={{
                                        width: "38px",
                                        height: "38px",
                                        borderRadius: "50%",
                                        overflow: "hidden",
                                        cursor: "pointer"
                                    }}
                                    onClick={() => navigate("/userpage")}
                                >
                                    <Image
                                        src={userInfo?.image_url}
                                        alt="User profile"
                                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                    />
                                </div>
                            </Col>
                        </Row>

                        {/* MEALS GRID */}
                        <Row className="g-3 g-md-4">
                            {filteredMeals.map((meal) => {
                                const mealName = meal.strMeal;
                                const mealPic = meal.strMealThumb;
                                const country = meal.strCountry;
                                const mealId = meal.idMeal;

                                return (
                                    <Col key={mealId} xs={12} sm={6} md={6} lg={4} xl={3}>
                                        <Card
                                            className="h-100 border-0 rounded-4 shadow-sm overflow-hidden"
                                            style={{
                                                backgroundColor: "#ffffff",
                                                transition: "transform 0.2s ease, box-shadow 0.2s ease"
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.transform = "translateY(-4px)";
                                                e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.12)";
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.transform = "translateY(0)";
                                                e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)";
                                            }}
                                        >
                                            {/* IMAGE CONTAINER */}
                                            <div style={{ position: "relative", height: "180px" }}>
                                                <Card.Img
                                                    src={mealPic}
                                                    alt={mealName}
                                                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                                />
                                                {country && (
                                                    <span
                                                        className="badge rounded-pill bg-light text-dark shadow-sm position-absolute"
                                                        style={{ top: "12px", right: "12px", fontSize: "12px", opacity: 0.9 }}
                                                    >
                                                        📍 {country}
                                                    </span>
                                                )}
                                            </div>

                                            {/* CARD CONTENT */}
                                            <Card.Body className="d-flex flex-column justify-content-between p-3 text-center">
                                                <Card.Title className="fw-bold fs-6 mb-3 text-dark" style={{ minHeight: "40px" }}>
                                                    {mealName}
                                                </Card.Title>

                                                <Button
                                                    onClick={() => handleMealInstruction(mealId)}
                                                    style={{ backgroundColor: "#2e7d32", border: "none" }}
                                                    className="w-100 rounded-3 fw-medium py-2 btn-sm text-white"
                                                >
                                                    View Ingredients / Instructions
                                                </Button>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                );
                            })}
                        </Row>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}