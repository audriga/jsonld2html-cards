const template = `
<div class="smlCard">
<div class = "header">
    {{^breadcrumbList.itemListElement}} {{type}}   {{#iconName}}<i class="fa-solid fa-{{iconName}} fa-1x" ></i>{{/iconName}}  {{/breadcrumbList.itemListElement}}
    <ul class="breadcrumb">
        {{#breadcrumbList.itemListElement}}<li><a href= {{item.id}} >{{item.name}}</a></li>{{/breadcrumbList.itemListElement}}
    </ul>


</div>
<div class="smlCardRow">
    <div class="image_column">

        <!-- If Picture is empty render the i frame with the iconName-->
        {{#pictureURL}}<img src="{{&pictureURL}}">{{/pictureURL}}
        <!-- If Picture is empty list, false or key doesnt exist render the i frame with the iconName -->
        {{^pictureURL}}<i class="fa-solid fa-{{iconName}} fa-6x" ></i>{{/pictureURL}}

    </div>

    <div class ="text_column">

        <h1 class="card_title"> {{title}}

        </h1>
        <p class="card_content">{{content}}
        </p>

        <div class="card_footnote">{{footer}}
        </div>


    </div>

</div>

    <div class="footer">
        {{#potentialAction}}<button type="button" class="actionButton" onclick="window.open('{{target}}', '_blank');">{{@type}}</button>{{/potentialAction}}

    </div>


</div>

<br>
<div class ="imageErrorMessage" id = "{{errorId}}"></div>
<br>
`

export default template;
