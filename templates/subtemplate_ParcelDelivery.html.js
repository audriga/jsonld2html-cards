const sub_template = `<p class="card_content">
    <span>{{partOfOrder.@type}}</span>
    <span>{{partOfOrder.orderNumber}}</span>
    <span>{{itemShipped.description}}</span>
</p>
<p class="card_content">
    <span>{{pickupTime}}</span>
    <span>{{deliveryAddress.name}}</span>
    <span>{{deliveryAddress.streetAddress}}</span>
    <span>{{deliveryAddress.addressLocality}}</span>
    <span>{{deliveryAddress.addressRegion}}</span>
    <span>{{deliveryAddress.postalCode}}</span>
    <span>{{deliveryAddress.addressCountry}}</span>
</p>
<p class="card_content">
    <span>{{expectedArrivalFrom}} - </span>
    <span>{{expectedArrivalUntil}}</span>
</p>`;

export default sub_template;
