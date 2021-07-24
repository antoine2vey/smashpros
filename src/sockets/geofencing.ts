export async function foo(req, res) {
  const { event } = req.body
  const { user, type, location } = event

  console.log(type, location.coordinates, user.metadata)
}