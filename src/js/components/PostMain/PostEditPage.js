import { getItem, removeItem, setItem } from '../../utils/Storage.js'
import { request } from '../../utils/api.js'
import { $creEle } from '../../utils/document.js'
import Editor from './Editor.js'

// PageEdit 페이지의 역할은 무엇일까?
// 상황에 맞는 Editor를 출력하고, 데이터를 불러와서 보여주는 역할을 수행?
export default function PostEditPage({ $target, initialState }) {
  const $page = $creEle('div')

  this.state = initialState

  let postLocalSaveKey = `temp-post-${this.state.postId}`

  const post = getItem(postLocalSaveKey, {
    title: '',
    content: '',
  })

  let timer = null

  const editor = new Editor({
    $target: $page,
    initialState: post,
    onEditing: async (post) => {
      // debounce
      if (timer !== null) {
        clearTimeout(timer)
      }

      timer = setTimeout(async () => {
        setItem(postLocalSaveKey, {
          ...post,
          tempSaveDate: new Date(),
        })

        const isNew = this.state.postId === 'new'

        if (isNew) {
          // async는 Resolved Promise를 반환하는 역할 수행.
          // Promise ( status, result ) 를 반환
          const createdPost = await request('/documents', {
            method: 'POST',
            body: JSON.stringify(post),
          })

          if (post.content) {
            await request(`/documents/${createdPost.id}`, {
              method: 'PUT',
              body: JSON.stringify(post),
            })
          }

          history.replaceState(null, null, `/documents/${createdPost.id}`)
          removeItem(postLocalSaveKey)
          this.setState({
            postId: createdPost.id,
          })
        } else {
          await request(`/documents/${post.id}`, {
            method: 'PUT',
            body: JSON.stringify(post),
          })
          removeItem(postLocalSaveKey)
        }
      }, 1000)
    },
  })

  this.setState = async (nextState) => {
    // 데이터가 올바르게 넘어 오지 않을 때
    if (nextState === undefined) {
      return
    }

    // 클릭된 Document가 현재와 다를 때는 데이터를 API를 통해 받아온다.
    if (this.state.postId !== nextState.postId) {
      this.state = nextState
      postLocalSaveKey = `temp-post-${this.state.postId}`

      if (this.state.postId === 'new') {
        const post = getItem(postLocalSaveKey, {
          title: '',
          content: '',
        })
        this.render()
        editor.setState(post)
      } else {
        await fetchPost()
      }

      return
    }

    // 같은 게시물을 여러번 눌렀을 때는 데이터를 받아 오지 않아서, post가 undefined 이다.
    const isOverLap = nextState.post === undefined ? true : false

    if (!isOverLap) {
      this.state = nextState
    }

    this.render()
    editor.setState(
      this.state.post || {
        title: '',
        content: '',
      },
    )
  }

  this.render = () => {
    $target.appendChild($page)
  }

  const fetchPost = async () => {
    const { postId } = this.state

    if (postId !== 'new') {
      const post = await request(`/documents/${postId}`)

      const tempPost = getItem(postLocalSaveKey, {
        title: '',
        content: '',
      })

      if (tempPost.tempSaveDate && post.created_at < tempPost.tempSaveDate) {
        if (confirm('저장되지 않은 데이터가 있습니다. 불러올까요?')) {
          this.setState({
            ...this.state,
            post: tempPost,
          })
          return
        }
      }

      this.setState({
        ...this.state,
        post,
      })
    }
  }
}
