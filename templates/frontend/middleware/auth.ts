export default ({ store, redirect }: any) => {
  if (!store.getters['auth/check']) {
    return redirect('/auth/login')
  }
}
