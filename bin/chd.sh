#!/usr/bin/env bash
export FORCE_COLOR="1"

result=""
command="$1"
name="$2"
directory="$3"

chd="$(dirname -- "${BASH_SOURCE[0]}")/run.js"

if [ -z "$directory" ]; then
  directory=$(readlink --canonicalize "$PWD")
else
  directory=$(readlink --canonicalize "$directory")
fi

declare -A commands=()
i=0

for file in "$(dirname -- "${BASH_SOURCE[0]}")/../src/commands"/* ;do
  commands+=(["$(basename "$file" .ts)"]="$i")
  ((i=i+1))
done

if [[ -v commands["$command"] ]]; then
  if [ -z "$name" ]; then
    node "$chd" "$command"
  elif [ -z "$directory" ] || [ "$command" != "add" ]; then
    node "$chd" "$command" "$name"
  else
    node "$chd" "$command" "$name" "$directory"
  fi
else

  # Run using .exe if Windows.
  if [ "$OSTYPE" == "msys" ] && [ -n "$command" ]; then
    result=$(node.exe "$chd" "$command")
  else
    if [ -z "$command" ]; then
      node "$chd"
    else
      result=$(node "$chd" "$command")
    fi
  fi
  if [ -d "$result" ]; then
    cd "$result" || exit
  else
    echo "$result"
  fi
fi
