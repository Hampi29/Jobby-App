import {Component} from 'react'
import {BsStarFill, BsBriefcaseFill} from 'react-icons/bs'
import {BiLinkExternal} from 'react-icons/bi'
import {MdLocationOn} from 'react-icons/md'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import Header from '../Header'
import SimilarJob from '../SimilarJob'
import './index.css'

const apiStatusConstants = {
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
  initial: 'INITIAL',
}

class AboutJob extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    similarJobs: [],
    jobdetails: {},
  }

  componentDidMount() {
    this.getJobData()
  }

  getJobData = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const url = `https://apis.ccbp.in/jobs/${id}`
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {Authorization: `Bearer ${jwtToken}`},
      method: 'GET',
    }
    const response = await fetch(url, options)
    if (response.ok === true) {
      const data = await response.json()
      const updatedJobDetails = [data.job_details].map(newJobDetails => ({
        companyLogoUrl: newJobDetails.company_logo_url,
        companyWebsiteUrl: newJobDetails.company_website_url,
        employmentType: newJobDetails.employment_type,
        id: newJobDetails.id,
        jobDescription: newJobDetails.job_description,
        skills: newJobDetails.skills.map(each => ({
          imageUrl: each.image_url,
          name: each.name,
        })),
        lifeAtCompany: {
          description: newJobDetails.life_at_company.description,
          imageUrl: newJobDetails.life_at_company.image_url,
        },
        location: newJobDetails.location,
        packagePerAnnum: newJobDetails.package_per_annum,
        rating: newJobDetails.rating,
        title: newJobDetails.title,
      }))
      const updatedSimilarJobs = data.similar_jobs.map(each => ({
        companyLogoUrl: each.company_logo_url,
        employmentType: each.employment_type,
        id: each.id,
        jobDescription: each.job_description,
        location: each.location,
        rating: each.rating,
        title: each.title,
      }))
      this.setState({
        jobdetails: updatedJobDetails[0],
        similarJobs: updatedSimilarJobs,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderSuccesView = () => {
    const {jobdetails, similarJobs} = this.state
    const {
      companyLogoUrl,
      companyWebsiteUrl,
      employmentType,
      jobDescription,
      skills,
      lifeAtCompany,
      location,
      rating,
      title,
      packagePerAnnum,
    } = jobdetails
    return (
      <div className="jobdetails-container">
        <div className="jobitem-container">
          <div>
            <div className="logo-title-container">
              <img
                src={companyLogoUrl}
                alt="job details company logo"
                className="company-logo"
              />
              <div className="rating-title-container">
                <h1 className="title">{title}</h1>
                <div className="rating-container">
                  <BsStarFill className="star-icon" />
                  <p>{rating}</p>
                </div>
              </div>
            </div>
            <div className="location-package-container">
              <div className="loc-type-container">
                <div className="icon-item ">
                  <MdLocationOn className="icons" />
                  <p>{location}</p>
                </div>
                <div className="icon-item ">
                  <BsBriefcaseFill className="icons" />
                  <p>{employmentType}</p>
                </div>
              </div>
              <p>{packagePerAnnum}</p>
            </div>
            <hr className="line" />
            <div className="description-link">
              <h1>Description</h1>
              <a href={companyWebsiteUrl}>
                Visit <BiLinkExternal />{' '}
              </a>
            </div>
            <p>{jobDescription}</p>
          </div>
          <h1>Skills</h1>
          <ul className="ul-skills-list">
            {skills.map(each => (
              <li className="skill-details" key={each.name}>
                <img
                  className="skill-image"
                  src={each.imageUrl}
                  alt={each.name}
                />
                <p>{each.name}</p>
              </li>
            ))}
          </ul>
          <div className="life-at-company">
            <div>
              <h1>Life at Company</h1>
              <p>{lifeAtCompany.description}</p>
            </div>
            <img
              className="life-at-company-img"
              src={lifeAtCompany.imageUrl}
              alt="life at company"
            />
          </div>
        </div>
        <h1>Similar Jobs</h1>
        <ul className="ul-skills-list">
          {similarJobs.map(each => (
            <SimilarJob key={each.id} similarjobdetails={each} />
          ))}
        </ul>
      </div>
    )
  }

  renderLoading = () => {
    return (
      <div className="loader-container" data-testid="loader">
        <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
      </div>
    )
  }

  onClickRetry = () => {
    this.getJobData()
  }

  renderFailureView = () => {
    return (
      <div className="failure">
        <img
          src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
          alt="failure view"
          className="failure-image"
        />
        <h1>Oops! Something Went Wrong</h1>
        <p>We cannot seem to find the page you are looking for.</p>
        <button className="retry-btn" onClick={this.onClickRetry}>
          Retry
        </button>
      </div>
    )
  }

  renderJobView = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderLoading()
      case apiStatusConstants.success:
        return this.renderSuccesView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    return (
      <div>
        <Header />
        {this.renderJobView()}
      </div>
    )
  }
}

export default AboutJob
