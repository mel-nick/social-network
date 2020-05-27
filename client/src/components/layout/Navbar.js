import React, {Fragment} from 'react';
import { Link } from 'react-router-dom';
import {connect} from 'react-redux';
import { PropTypes } from 'prop-types';
import { logout } from '../../actions/auth';

const Navbar = ({auth:{ user, isAuthenticated, loading}, logout }) => {
  const authLinks = (
    <ul>
        <li>
            <Link to="/profiles">Developers</Link>
        </li>
        <li>
            <Link to="/posts">Posts</Link>
        </li>
        <li>
            <Link to="/dashboard">
              <span><i className="far fa-user"></i>{' '}</span>
              <span className="hide-sm">Dashboard</span>
            </Link>
        </li>
        <li>
          {!loading && isAuthenticated && user!==null && 
            <Link to={`/profile/${user._id}`}>
                <img
                  className="round-img nav-user-image"
                  src={user.avatar}
                  alt="avatar"
                />
          </Link>}
        </li>
        <li>
              <Link  onClick={logout} to="#!">
                <i className="fas fa-sign-out-alt"></i>{' '}
                <span className="hide-sm">Logout</span>
              </Link>
        </li>
    </ul>
  );

  const guestLinks = (
    <ul>
        <li><Link to="/profiles">Developers</Link></li>
        <li><Link to="/register">Register</Link></li>
        <li><Link to="/login">Login</Link></li>
    </ul>

  );  

    return (
        <nav className="navbar bg-dark">
        <h1>
          <Link to="/">DevWeb <i className="fas fa-network-wired"></i></Link>
        </h1>
        { !loading && (<Fragment>{isAuthenticated ? authLinks : guestLinks}</Fragment>) }
      </nav>
    )
}

Navbar.propTypes = {
  logout: PropTypes.func.isRequired,
  auth:PropTypes.object.isRequired
}

const mapStateToProps = state =>({
  auth: state.auth
})

export default connect(mapStateToProps, { logout })(Navbar);
