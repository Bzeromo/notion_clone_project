import { pushUrl } from '../../utils/Router.js'
import { $creEle } from '../../utils/document.js'

export default function PostList({ $target, initialState, onAttach, onDelete }) {
  const $postList = $creEle('div')
  $postList.className = 'postList'
  $target.appendChild($postList)

  // 초기에는 [] 빈 값을 전달 받고,
  this.state = initialState

  // PostPage가 렌더 될 때, 데이터를 받아서 업데이트를 해준다.
  this.setState = (nextState) => {
    this.state = nextState
    this.render()
  }

  this.createTreeView = (data) => {
    let str = ''

    // 템플릿으로 빼서 사용하는게 좋지 않을까 생각 중.
    for (const key in data) {
      if (data[key].documents.length) {
        str += `<li class="dataList" data-id="${data[key].id}">${data[key].title}
                  <button class="addBtn" data-id="${data[key].id}">+</button>
                  <button class="delBtn" data-id="${data[key].id}">x</button>
                  <ul>${this.createTreeView(data[key].documents)}</ul>
                </li>`
      } else {
        str += `<li class="dataList" data-id="${data[key].id}">
                  ${data[key].title}
                 <button class="addBtn" data-id="${data[key].id}">+</button>
                 <button class="delBtn" data-id="${data[key].id}">X</button>
                </li>`
      }
    }

    return str
  }

  this.render = () => {
    $postList.innerHTML = `
      <ul>
        ${this.state
          .map(
            (post) => `
            <li class="dataList"data-id="${post.id}">
              🗒  ${post.title}
              <button class="addBtn" data-id="${post.id}">
                +
              </button>
              <button class="delBtn" data-id="${post.id}">
                <i class="fas fa-trash-alt"></i>
              </button>
            </li>
            ${post.documents ? `<ul>${this.createTreeView(post.documents)}</ul>` : ''}
            `,
          )
          .join('')}
      </ul>
    `
  }

  this.render()

  $postList.addEventListener('click', (e) => {
    const { id } = e.target.dataset
    const { className } = e.target
    const $li = e.target.closest('li')

    switch (className) {
      case 'addBtn':
        onAttach(id)
        break

      case 'delBtn':
        onDelete(id)
        break

      case 'dataList':
        if ($li) {
          const { id } = $li.dataset
          pushUrl(`/documents/${id}`)
        }
        break
    }
  })
}
