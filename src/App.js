import {Switch, Route, Redirect} from 'react-router-dom'

import './App.css'

import Login from './components/Login'
import Home from './components/Home'
import AllJobs from './components/AllJobs'
import ProtectedRoute from './components/ProtectedRoute'
import NotFound from './components/NotFound'
import AboutJob from './components/AboutJob'

// These are the lists used in the application. You can move them to any component needed.

// Replace your code here
const App = () => (
  <>
    <Switch>
      <Route exact path="/login" component={Login} />
      <ProtectedRoute exact path="/" component={Home} />
      <ProtectedRoute exact path="/jobs" component={AllJobs} />
      <ProtectedRoute exact path="/jobs/:id" component={AboutJob} />
      <Route exact path="/not-found" component={NotFound} />
      <Redirect to="/not-found" />
    </Switch>
  </>
)

export default App
