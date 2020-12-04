/**
 * 其他需要登陆的页面如果未登陆，就跳转到登陆
 */
export default function({ store, redirect }){
  if(!store.state.user){
    return redirect('/login')
  }
}