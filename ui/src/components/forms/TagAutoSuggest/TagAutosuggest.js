import PropTypes from "prop-types";
import React from "react";
import Autosuggest from "react-autosuggest";

const getSuggestionValue = suggestion => suggestion.name;

const Highlighter = ({ str, substr }) => {
  const parts = str.split(new RegExp(`(${substr})`, "gi"));
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === substr.toLowerCase() ? (
          <span key={`${part}-${i}`} className="highlighted">
            {part}
          </span>
        ) : (
          part
        )
      )}
    </>
  );
};

const renderSuggestion = (suggestion, { query }) => (
  <div className={suggestion.isNew ? "new" : ""}>
    {suggestion.isNew ? (
      suggestion.name
    ) : (
      <Highlighter str={suggestion.name} substr={query} />
    )}
  </div>
);

class TagAutoSuggest extends React.Component {
  constructor() {
    super();

    this.state = {
      value: "",
      suggestions: []
    };
  }

  onChange = (event, { newValue }) => this.setState({ value: newValue });

  // Autosuggest will call this function every time you need to update suggestions.
  onSuggestionsFetchRequested = ({ value }) => {
    this.setState({ suggestions: this.props.getSuggestions(value) });
  };

  // Autosuggest will call this function every time you need to clear suggestions.
  onSuggestionsClearRequested = () => {
    this.setState({ suggestions: [] });
  };

  render() {
    const { value, suggestions } = this.state;
    const { on } = this.props;

    // Autosuggest will pass through all these props to the input.
    const inputProps = {
      onChange: this.onChange,
      placeholder: `+ Add ${on}`,
      value
    };

    // Finally, render it!
    return (
      <div className={on}>
        <Autosuggest
          getSuggestionValue={getSuggestionValue}
          inputProps={inputProps}
          suggestions={suggestions}
          onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
          onSuggestionsClearRequested={this.onSuggestionsClearRequested}
          onSuggestionSelected={e => {
            this.props.setTagOn({
              variables: {
                tagName: e.target.innerText,
                on: this.props.on,
                targetType: this.props.type,
                targetId: this.props.id
              }
            });
            this.setState({ value: "" });
          }}
          renderSuggestion={renderSuggestion}
        />
      </div>
    );
  }
}

TagAutoSuggest.propTypes = {
  getSuggestions: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  on: PropTypes.string.isRequired,
  setTagOn: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired
};

export default TagAutoSuggest;
