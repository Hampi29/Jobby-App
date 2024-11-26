import {Component} from 'react'
import Loader from 'react-loader-spinner'
import {AiOutlineSearch} from 'react-icons/ai'
import Cookies from 'js-cookie'

import Header from '../Header'
import JobItem from '../JobItem'

import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const apiStatusConstants = {
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
  initial: 'INITIAL',
}

class AllJobs extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    apiJobStatus: apiStatusConstants.initial,
    jobsData: [],
    profileData: {},
    searchInput: '',
    activeCheckboxList: [],
    activeSalaryRange: '',
  }

  componentDidMount() {
    this.getProfileDetails()
    this.getJobs()
  }

  getJobs = async () => {
    this.setState({apiJobStatus: apiStatusConstants.inProgress})
    const {searchInput, activeCheckboxList, activeSalaryRange} = this.state
    const type = activeCheckboxList.join(',')
    const jwtToken = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/jobs?employment_type=${type}&minimum_package=${activeSalaryRange}&search=${searchInput}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok === true) {
      const fetchedJobsData = data.jobs.map(each => ({
        companyLogoUrl: each.company_logo_url,
        employmentType: each.employment_type,
        id: each.id,
        jobDescription: each.job_description,
        location: each.location,
        packagePerAnnum: each.package_per_annum,
        rating: each.rating,
        title: each.title,
      }))
      this.setState({
        apiJobStatus: apiStatusConstants.success,
        jobsData: fetchedJobsData,
      })
    } else {
      this.setState({apiJobStatus: apiStatusConstants.failure})
    }
  }

  getProfileDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const url = 'https://apis.ccbp.in/profile'
    const jwtToken = Cookies.get('jwt_token')
    const option = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, option)
    const data = await response.json()
    if (response.ok === true) {
      const profile = data.profile_details
      const details = {
        name: profile.name,
        profileImageUrl: profile.profile_image_url,
        shortBio: profile.short_bio,
      }
      this.setState({
        apiStatus: apiStatusConstants.success,
        profileData: details,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  onClickCheckbox = event => {
    const {activeCheckboxList} = this.state
    if (activeCheckboxList.includes(event.target.id)) {
      const updatedList = activeCheckboxList.filter(
        each => each !== event.target.id,
      )
      this.setState({activeCheckboxList: updatedList}, this.getJobs)
    } else {
      this.setState(
        prev => ({
          activeCheckboxList: [...prev.activeCheckboxList, event.target.id],
        }),
        this.getJobs,
      )
    }
  }

  onClickRadiobox = event => {
    this.setState({activeSalaryRange: event.target.id}, this.getJobs)
  }

  successProfilecard = () => {
    const {profileData} = this.state
    const {name, profileImageUrl, shortBio} = profileData
    return (
      <div className="profile-card">
        <img src={profileImageUrl} alt="profile" className="profImg" />
        <h1>{name}</h1>
        <p>{shortBio}</p>
      </div>
    )
  }

  onRetryProfile = () => this.getProfileDetails()
  onRetryJobs = () => this.getJobs()

  failureProfileCard = () => {
    return (
      <div className="failure">
        <h1>profile Fail</h1>
        <button className="retry-btn" onClick={this.onRetryProfile}>
          Retry
        </button>
      </div>
    )
  }

  onLoading = () => {
    return (
      <div className="loader-container" data-testid="loader">
        <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
      </div>
    )
  }

  checkbokView = () => {
    return (
      <ul className="emptyp-list">
        {employmentTypesList.map(each => (
          <li key={each.employmentTypeId}>
            <input
              type="checkbox"
              id={each.employmentTypeId}
              onClick={this.onClickCheckbox}
            />
            <label for={each.employmentTypeId}>{each.label}</label>
          </li>
        ))}
      </ul>
    )
  }

  radioboxView = () => {
    return (
      <ul className="emptyp-list">
        {salaryRangesList.map(each => (
          <li key={each.salaryRangeId}>
            <input
              id={each.salaryRangeId}
              type="radio"
              name="option"
              onClick={this.onClickRadiobox}
            />
            <label for={each.salaryRangeId}>{each.label}</label>
          </li>
        ))}
      </ul>
    )
  }

  successJobView = () => {
    const {jobsData} = this.state
    if (jobsData.length > 0) {
      return (
        <ul className="emptyp-list">
          {jobsData.map(each => (
            <JobItem key={each.id} jobItem={each} />
          ))}
        </ul>
      )
    } else {
      return (
        <div className="failure">
          <img
            src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
            alt="no jobs"
            className="no-jobs"
          />
          <h1>No jobs found</h1>
          <p>We could not find any jobs. Try other filters.</p>
        </div>
      )
    }
  }

  failureJobView = () => {
    return (
      <div className="failure">
        <img
          src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
          alt="failure view"
          className="no-jobs"
        />
        <h1>Oops! Something Went Wrong</h1>
        <p>We cannot seem to find the page you are looking for.</p>
        <button className="retry-btn" onClick={this.onRetryJobs}>
          Retry
        </button>
      </div>
    )
  }

  onChangingSearch = event => {
    this.setState({searchInput: event.target.value})
  }

  onClickingEnter = event => {
    if (event.key === 'Enter') {
      this.getJobs()
    }
  }
  onSubmitSearch = () => {
    this.getJobs()
  }

  renderSearch = () => {
    const {searchInput} = this.state
    return (
      <div>
        <input
          type="search"
          value={searchInput}
          placeholder="Search"
          onChange={this.onChangingSearch}
          onKeyDown={this.onClickingEnter}
          className="search-input"
        />
        <button
          type="button"
          className="searchbtn"
          data-testid="searchButton"
          onClick="onSubmitSearch"
        >
          <AiOutlineSearch className="search-icon" />
        </button>
      </div>
    )
  }

  renderJobs = () => {
    const {apiJobStatus} = this.state
    switch (apiJobStatus) {
      case apiStatusConstants.success:
        return this.successJobView()
      case apiStatusConstants.failure:
        return this.failureJobView()
      case apiStatusConstants.inProgress:
        return this.onLoading()
      default:
        return null
    }
  }

  renderProfile = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.successProfilecard()
      case apiStatusConstants.failure:
        return this.failureProfileCard()
      case apiStatusConstants.inProgress:
        return this.onLoading()
      default:
        return null
    }
  }

  render() {
    const {jobsData, profileData, searchInput, activeSalaryRange} = this.state
    return (
      <div>
        <Header />
        <div className="job-container">
          <div className="side-bar-container">
            {this.renderProfile()}
            <hr className="hr-line" />
            <div className="filters">
              <h1 className="text">Type of Employment</h1>
              {this.checkbokView()}
              <hr className="hr-line" />
              <h1 className="text">Salary Range</h1>
              {this.radioboxView()}
            </div>
          </div>
          <div className="jobscontainer">
            {this.renderSearch()}
            {this.renderJobs()}
          </div>
        </div>
      </div>
    )
  }
}

export default AllJobs
