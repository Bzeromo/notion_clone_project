import { pushUrl } from './Router.js'
import { $creEle } from './document.js'

export default function LinkButton({ $target, initialState }) {
  const $linkButton = $creEle('button')

  $target.appendChild($linkButton)

  this.state = initialState

  this.render = () => {
    const { text, name } = this.state
    $linkButton.textContent = text

    if (name) {
      $linkButton.className = name
    }
  }

  this.render()

  $linkButton.addEventListener('click', () => {
    const { link } = this.state
    pushUrl(`/documents/${link}`)
  })
}
