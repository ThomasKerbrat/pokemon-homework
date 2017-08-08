import React, { Component } from 'react'

export class SearchBar extends Component {
  constructor(props) {
    super(props)
    this.handleSearchTextInputChange = this.handleSearchTextInputChange.bind(this)
  }

  handleSearchTextInputChange(event) {
    this.props.onSearchTextInput(event.target.value)
  }

  render() {
    return (
      <form>
        <input
          type="text"
          placeholder="Search..."
          value={this.props.searchText}
          onChange={this.handleSearchTextInputChange}
        />
      </form>
    )
  }
}
