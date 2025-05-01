import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";


const Upload = () => {
  const [conditionMet, setConditionMet] = useState(false);
  const navigate = useNavigate();

  const handleClick = () => {
    if (conditionMet) {
      navigate('/characters');
    }
  };

  return (
    <div className="grid items-center justify-center gap-1.5">
      <h1 className="text-2l font-bold">Welcome to BezierBox</h1>
		<Label htmlFor="ttf-file">Select a TTF File</Label>
	  	<Input id="ttf-file" type="file" accept=".ttf" onChange={(e) => {
				if (e.target.files.length > 0) {
					setConditionMet(true);
				}
			}}
		/>
      	<Button onClick={handleClick} disabled={!conditionMet}>
        Confirm File Choice
      </Button>
    </div>
  );
};

export default Upload;
