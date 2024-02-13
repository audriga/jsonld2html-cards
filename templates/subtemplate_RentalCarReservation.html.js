const template = `<p class="card_content">
    <span>{{@type}}</span>
    <span>{{reservationFor.name}}</span>
    <span>{{reservationFor.brand.name}}</span>
    <span>{{reservationFor.model}}</span>
    <span>{{reservationNumber}}</span>
    <span>{{underName.name}}</span>
</p>
<p class="card_content">
    <span>{{pickupTime}}</span>
    <span>{{pickupLocation.name}}</span>
    <span>{{pickupLocation.address.streetAddress}}</span>
    <span>{{pickupLocation.address.addressLocality}}</span>
    <span>{{pickupLocation.address.addressRegion}}</span>
    <span>{{pickupLocation.address.postalCode}}</span>
    <span>{{pickupLocation.address.addressCountry}}</span>
</p>
<!-- <p class="card_content">
    <span>{{dropoffTime}}</span>
    <span>{{dropoffLocation.name}}</span>
    <span>{{dropoffLocation.address.streetAddress}}</span>
    <span>{{dropoffLocation.address.addressLocality}}</span>
    <span>{{dropoffLocation.address.addressRegion}}</span>
    <span>{{dropoffLocation.address.postalCode}}</span>
    <span>{{dropoffLocation.address.addressCountry}}</span>
</p> -->`;
export default template;