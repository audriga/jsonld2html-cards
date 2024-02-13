const sub_template = `<p class="card_content">
    <span>{{reservationFor.name}}</span>
    <span>{{reservationFor.address.streetAddress}}</span>
    <span>{{reservationFor.address.addressLocality}}</span>
    <span>{{reservationFor.address.addressRegion}}</span>
    <span>{{reservationFor.address.postalCode}}</span>
    <span>{{reservationFor.address.addressCountry}}</span>
</p>
<p class="card_content">
    <span>{{reservationNumber}}</span>
    <span>{{underName.name}}</span>
    <span>{{startTime}}</span>
</p>`;
export default sub_template;
