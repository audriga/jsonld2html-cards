const Mustache = require('mustache');

var snippet = `{
  "@context": "http://schema.org",
  "@type": "FlightReservation",
  "reservationNumber": "RXJ34P",
  "reservationStatus": "http://schema.org/Confirmed",
  "underName": {
    "@type": "Person",
    "name": "Eva Green"
  },
  "reservationFor": {
    "@type": "Flight",
    "flightNumber": "110",
    "airline": {
      "@type": "Airline",
      "name": "United",
      "iataCode": "UA"
    },
    "departureAirport": {
      "@type": "Airport",
      "name": "San Francisco Airport",
      "iataCode": "SFO"
    },
    "departureTime": "2024-03-04T20:15:00-08:00",
    "arrivalAirport": {
      "@type": "Airport",
      "name": "John F. Kennedy International Airport",
      "iataCode": "JFK"
    },
    "arrivalTime": "2024-03-05T06:30:00-05:00"
  }
}`;

var template = `
  <div class="reservation">
		<div class="departure">
			<div class="iata">
				{{ reservationFor.departureAirport.iataCode }}
			</div>
			<div class="airport">
				{{ reservationFor.departureAirport.name }}
			</div>
			{{ # reservationFor.departureTime }}
			<div>
				{{ reservationFor.departureTime }}
			</div>
			{{ / reservationFor.departureTime }}
		</div>
		<div class="connection">
			<div><span aria-hidden=false
        aria-label="Airplane"
        class="material-design-icon airplane-icon"
        role="img">
    <svg fill="currentColor"
         class="material-design-icon__svg"
         width=24
         height=24
         viewBox="0 0 24 24">
      <path d="M21,16V14L13,9V3.5A1.5,1.5 0 0,0 11.5,2A1.5,1.5 0 0,0 10,3.5V9L2,14V16L10,13.5V19L8,20.5V22L11.5,21L15,22V20.5L13,19V13.5L21,16Z">
        <title "Airplane" </title>
      </path>
    </svg>
  </span>
  </div>
  <div>{{reservationFor.airline.iataCode}} {{ reservationFor.flightNumber }}</div>'''/*'''
			{{ # reservation }}
			<div>
				{{ replaced }}
			</div>
			{{ / reservation }}
			{{ ^ reservation }}
			<div>
				<ArrowIcon decorative />
			</div>
			{{ / reservation }}'''*/'''
		</div>
		<div class="arrival">
			<div class="iata">
				{{ reservationFor.arrivalAirport.iataCode }}
			</div>
			<div class="airport">
				{{ reservationFor.arrivalAirport.name }}
			</div>
			{{ # reservationFor.arrivalTime }}
			<div>
				{{ reservationFor.arrivalTime }}
			</div>
			{{ / reservationFor.arrivalTime }}
		</div>
	</div>
`;

const obj = JSON.parse(snippet);

const view = {
  title: "Joe",
  calc: () => ( 2 + 4 )
};

const output = Mustache.render("{{title}} spends {{calc}}", view);

console.log(output);

const output2 = Mustache.render(template, obj);

console.log(output2);
