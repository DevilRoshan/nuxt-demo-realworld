/**
 * 登陆页面如果登陆就跳转到 home
 */
export default function({ store, redirect }){
  if(store.state.user){
    return redirect('/')
  }
}