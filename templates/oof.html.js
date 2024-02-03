const template = `
<table cellpadding="32">
    <tbody>
    <tr>
        <td>The user is out-of-office from {{ start }} till {{ end }}. Mails will {{#isForwarded}}{{/isForwarded}}{{^isForwarded}}not {{/isForwarded}}be forwarded.</td>
    </tr>
    <tr>
        <td>During absence, contact {{replacement.0.name}} ({{replacement.0.email}} / {{replacement.0.phone}}) for {{replacement.0.topic}} or {{replacement.1.name}} ({{replacement.1.email}} / {{replacement.1.phone}}) for {{replacement.1.topic}}.</td>
    </tr>
    </tbody>
    </table>
`

export default template;
