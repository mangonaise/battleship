import React from 'react';
import '../styles/GithubFooter.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';

const GithubFooter = () => {
  return (
    <div className="footer">
      <div>by mangonaise</div>
      <FontAwesomeIcon icon={faHeart} color="rgb(230, 101, 144)"/>
      <a href="https://github.com/mangonaise/battleship">github</a>
    </div>
  )
}

export default GithubFooter;