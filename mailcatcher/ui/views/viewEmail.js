const layout = require('./partials/layout');

module.exports = email =>
  layout(`
    <table>
      <tr>
        <th>subject</th>
        <td>${email.subject}</td>
      </tr>
      <tr>
        <th>from</th>
        <td>${email.from.value.map(v => v.address).join(', ')}</td>
      </tr>
      <tr>
        <th>to</th>
        <td>${email.to.value.map(v => v.address).join(', ')}</td>
      </tr>
      <tr>
        <th>date</th>
        <td>${email.date}</td>
      </tr>
      <tr>
        <th>messageId</th>
        <td>${email.messageId}</td>
      </tr>
    </table>

    <hr />

    <h2>Html</h2>
    ${email.html}

    <hr />

    <h2>Text</h2>
    <pre>${email.text}</pre>

    <hr />

    <h2>TextAsHtml</h2>
    ${email.textAsHtml}
`);
