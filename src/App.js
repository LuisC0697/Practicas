import React, { Component } from 'react';
import Greeting from './Components/Greeting'
import moment from 'moment'
import {
  Container,
  Row,
  Col,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  ListGroup,
  ListGroupItem

} from 'reactstrap'
import './App.css';
import LineChart from './Components/LineChart';

class App extends Component {
  constructor() {
    super();
    this.state = {
      greeting: "Estadisticas de Covid-19 en Grafica",//
      countries: [],
      filteredCountries: [],
      countrySlug: "",
      country: "",
      isListHidden: true,
      startDate: "",
      endDate: "",
      countryData: []
    }
    this.changeCountryHandler = this.changeCountryHandler.bind(this) //componentes
    this.selectCountryHandler = this.selectCountryHandler.bind(this)
    this.changeDateHandler = this.changeDateHandler.bind(this)
    this.getCountryData = this.getCountryData.bind(this)
  }

  componentDidMount() {
    console.log("ya funciono ")
    fetch('https://api.covid19api.com/countries').then(response => {//api de JS para peticiones ajax
      response.json().then(json => {
        console.log(json)
        this.setState({ countries: json })//definir o modificar valor del estado
      })
    })
  }

  changeCountryHandler(event) {
    let value = event.target.value.toLowerCase()//target elemento especifico que construye un obj input construye value y lo almacena
    console.log(value)

    let filteredCountries = this.state.countries.filter(country => {
      return country.Slug.includes(value)
    })

    console.log(filteredCountries)

    this.setState({ filteredCountries, isListHidden: false })
  }

  selectCountryHandler(event) {
    //extrae country y countryslug y guardar, los sacamos de las variables de listgroup countryName y
    let country = event.target.dataset.countryName//camel case 
    let countrySlug = event.target.dataset.countrySlug
    this.setState({ country, countrySlug, isListHidden: true })
  }

  changeDateHandler(event) {
    let key = event.target.name //llve del state a modificar y puede valer startdate o enddate en cualquier momento
    let value = moment(event.target.value).toISOString(); //necesito state inicio y fin ToISO para el form de fecha

    this.setState({ [key]: value })//equivalente a poner start o end date y recibe lo de value
  }

  getCountryData() {//conseguir los datos para graficar
    let { countrySlug, startDate, endDate } = this.state
    fetch(`https://api.covid19api.com/country/${countrySlug}?from=${startDate}&to=${endDate}`).then(response => {
      response.json().then(json => {//json nos devuelve una promesa
        console.log(json)
        this.setState ( { countryData : json })
      })
    })
  }

  //https://api.covid19api.com/country/south-africa?from=2020-03-01T00:00:00Z&to=2020-04-01T00:00:00Z

  render() {
    let {greeting} = this.state 
    return (
      <div className="App bg-dark">
        <Container fluid>
          <Row>
            <Col XS="12">
              <Greeting greeting={greeting} foo="bar" />
            </Col>
            <Col XS="12" md="4">
              <Form className="p-3 bg-light shadow rounded">
                <FormGroup className="position-relative">
                  <Label className="text-dark">País:</Label>
                  <Input
                    type="text"
                    name="country"
                    id="country"
                    placeholder="Escribe el nombre del País"
                    value={this.state.country}
                    onChange={this.changeCountryHandler}
                  ></Input>
                  <ListGroup>
                    {
                      this.state.filteredCountries.map((country, index) => {
                        return (
                          <ListGroupItem
                            key={index}
                            className={`text-dark ${this.state.isListHidden ? 'd-none' : ''}`}//dnone oculta elemento. si esta en verdadero retorna dnone sino string vacio nada
                            data-country-name={country.Country}
                            data-country-slug={country.Slug}
                            onClick={this.selectCountryHandler}
                            action
                          >{country.Country}</ListGroupItem>
                        )
                      })
                    }
                  </ListGroup>
                </FormGroup>
                <FormGroup>
                  <Label className="text-dark">Desde:</Label>
                  <Input
                    type="date"
                    name="startDate"
                    id="startDate"
                    onChange={this.changeDateHandler}
                  ></Input>
                </FormGroup>
                <FormGroup>
                  <Label className="text-dark">Hasta:</Label>
                  <Input
                    type="date"
                    name="endDate"
                    id="endDate"
                    onChange={this.changeDateHandler}
                  ></Input>
                </FormGroup>
                <Button
                  color="secondary"
                  className="btn-black"
                  type="button"
                  onClick={this.getCountryData}
                >Ver Gráfica</Button>
              </Form>
            </Col>
            <Col XS="12" md="8">
              <LineChart 
              countryData = {this.state.countryData}
              />
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default App;//nombre del componente
