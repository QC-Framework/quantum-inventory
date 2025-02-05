import React, { useEffect } from 'react';
import { connect, useSelector } from 'react-redux';
import { Slide } from '@mui/material';
import { makeStyles } from '@mui/styles';

import Slot from './Slot';
import { getItemImage } from './item';

const useStyles = makeStyles((theme) => ({
    slide: {
        position: 'absolute',
        background: '#202020',
        padding: 5,
        border: '1px solid rgba(255, 255, 255, 0.04)',
        height: 'fit-content',
		width: 'fit-content',
        bottom: 5,
        left: 0,
        right: 0,
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 2,
		borderRadius: 5,
    },
    equipped: {
        marginRight: 20,
    },
}));

export default connect()((props) => {
	const classes = useStyles();
	const hidden = useSelector((state) => state.app.showHotbar);
	const showing = useSelector((state) => state.app.showing);
	const hbItems = useSelector((state) => state.app.hotbarItems);
	const equipped = useSelector((state) => state.app.equipped);
	const items = useSelector((state) => state.inventory.items);
	const itemsLoaded = useSelector((state) => state.inventory.itemsLoaded);
	const playerInventory = useSelector((state) => state.inventory.player);

	const mode = useSelector((state) => state.app.mode);

	useEffect(() => {
		let tmr = null;
		if (hidden) {
			tmr = setTimeout(() => {
				props.dispatch({
					type: 'HOTBAR_HIDE',
				});
			}, 5000);

			return () => {
				clearTimeout(tmr);
			};
		}
	}, [hidden]);

	if (mode === 'crafting') {
		return null;
	}

	if (!itemsLoaded || !Boolean(hbItems) || Object.keys(items).length == 0)
		return null;
	return (
		<Slide direction="up" in={hidden} className={classes.slide}>
			<div>
				{[...Array(4).keys()].map((value) => {
					return (
						<Slot
							mini
							solid
							inHotbar={true}
							showing={showing}
							key={value + 1}
							slot={value + 1}
							owner={playerInventory.owner}
							invType={playerInventory.invType}
							hotkeys={true}
							data={
								hbItems.filter((s) => s.Slot == value + 1)
									? hbItems.filter(
											(s) => s.Slot == value + 1,
									  )[0]
									: {}
							}
						/>
					);
				})}
				{Boolean(equipped) && (
					<Slot
						mini
						solid
						equipped
						inHotbar={true}
						showing={showing}
						owner={playerInventory.owner}
						invType={playerInventory.invType}
						slot={equipped.Slot}
						hotkeys={false}
						data={equipped}
					/>
				)}
			</div>
		</Slide>
	);
});
