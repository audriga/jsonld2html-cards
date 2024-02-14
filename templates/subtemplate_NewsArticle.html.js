export const news = `
<h1 class="card_title"> {{headline}}</h1>

{{#articleBody}}
    <p class="card_content">
        {{articleBody}}
    </p>
{{/articleBody}}

    
{{^articleBody}}

    <p class="card_content">
        {{description}}
    </p>

{{/articleBody}}
`;
