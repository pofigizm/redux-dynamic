workflow "New workflow" {
  on = "push"
  resolves = ["test"]
}

action "install" {
  uses = "actions/npm@master"
  runs = "install"
}

action "test" {
  uses = "actions/npm@master"
  needs = ["install"]
  runs = "test"
}
