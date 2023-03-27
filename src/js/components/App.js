import PostPage from './SideBar/PostPage.js'
import PostEditPage from './PostMain/PostEditPage.js'
import { $creEle } from '../utils/document.js'
import { catchTitle, initRouter, popUrl } from '../utils/Router.js'

export default function App({ $target }) {
  const $listContainer = $creEle('div')
  $listContainer.className = 'listContainer'
  const $rendingContainer = $creEle('div')
  $rendingContainer.className = 'rendingContainer'
  $target.appendChild($listContainer)
  $target.appendChild($rendingContainer)

  const postPage = new PostPage({
    $target: $listContainer,
  })

  const postEditPage = new PostEditPage({
    $target: $rendingContainer,
    initialState: {
      postId: 'new',
      post: {
        title: '',
        content: '',
      },
    },
  })

  this.route = () => {
    const { pathname } = window.location

    if (pathname.indexOf('/documents/') === 0) {
      const [, , postId] = pathname.split('/')
      postEditPage.setState({ postId })
    }

    postPage.setState()
  }

  this.route()

  // 아이디 넘어오면 해당 URL을 Push State
  initRouter(() => this.route())

  // 뒤로 가기.
  popUrl(() => this.route())

  // 문서 제목이 바뀌면, 리스트에 적용
  catchTitle(() => postPage.setState())
}
