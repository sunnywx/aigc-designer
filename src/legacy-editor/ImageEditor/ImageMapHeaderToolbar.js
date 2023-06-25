import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Flex } from '../flex';
import ImageMapList from './ImageMapList';
import { IconButton } from '../common';
import {
	FaLayerGroup,
	FaAngleUp,
	FaAngleDown,
	FaAngleDoubleUp,
	FaAngleDoubleDown,
	FaAlignLeft,
	FaAlignCenter,
	FaAlignRight,
	FaObjectGroup,
	FaObjectUngroup,
	FaCrop,
	FaCheck,
	FaTimes,
	FaImage,
	FaClone,
	FaTrash,
	FaUndoAlt,
	FaRedoAlt
} from 'react-icons/fa';


class ImageMapHeaderToolbar extends Component {
	static propTypes = {
		canvasRef: PropTypes.any,
		selectedItem: PropTypes.object,
	};

	render() {
		const { canvasRef, selectedItem } = this.props;
		const isCropping = canvasRef ? canvasRef.handler?.interactionMode === 'crop' : false;
		return (
			<Flex className="rde-editor-header-toolbar-container" flex="1">
				<Flex.Item className="rde-canvas-toolbar rde-canvas-toolbar-list">
					<IconButton
						className="rde-action-btn"
						icon={ <FaLayerGroup /> }
						tooltipTitle="FabricCanvas list"
					/>
					<div className="rde-canvas-list">
						<ImageMapList canvasRef={canvasRef} selectedItem={selectedItem} />
					</div>
				</Flex.Item>
				<Flex.Item className="rde-canvas-toolbar rde-canvas-toolbar-alignment">
					<IconButton
						className="rde-action-btn"
						disabled={isCropping}
						onClick={() => canvasRef.handler?.bringForward()}
						icon={ <FaAngleUp /> }
						tooltipTitle="Bring forward"
					/>
					<IconButton
						className="rde-action-btn"
						disabled={isCropping}
						onClick={() => canvasRef.handler?.sendBackwards()}
						icon={ <FaAngleDown /> }
						tooltipTitle="Send backwards"
					/>
					<IconButton
						className="rde-action-btn"
						disabled={isCropping}
						onClick={() => canvasRef.handler?.bringToFront()}
						icon={ <FaAngleDoubleUp /> }
						tooltipTitle="Bring to front"
					/>
					<IconButton
						className="rde-action-btn"
						disabled={isCropping}
						onClick={() => canvasRef.handler?.sendToBack()}
						icon={ <FaAngleDoubleDown /> }
						tooltipTitle="Bring to front"
					/>
				</Flex.Item>
				<Flex.Item className="rde-canvas-toolbar rde-canvas-toolbar-alignment">
					<IconButton
						className="rde-action-btn"
						disabled={isCropping}
						onClick={() => canvasRef.handler?.alignmentHandler.left()}
						icon={ <FaAlignLeft /> }
						tooltipTitle="Align left"
					/>
					<IconButton
						className="rde-action-btn"
						disabled={isCropping}
						onClick={() => canvasRef.handler?.alignmentHandler.center()}
						icon={ <FaAlignCenter /> }
						tooltipTitle="Align center"
					/>
					<IconButton
						className="rde-action-btn"
						disabled={isCropping}
						onClick={() => canvasRef.handler?.alignmentHandler.right()}
						icon={ <FaAlignRight /> }
						tooltipTitle="Align right"
					/>
				</Flex.Item>
				<Flex.Item className="rde-canvas-toolbar rde-canvas-toolbar-group">
					<IconButton
						className="rde-action-btn"
						disabled={isCropping}
						onClick={() => canvasRef.handler?.toGroup()}
						icon={ <FaObjectGroup /> }
						tooltipTitle="Object group"
					/>
					<IconButton
						className="rde-action-btn"
						disabled={isCropping}
						onClick={() => canvasRef.handler?.toActiveSelection()}
						icon={ <FaObjectUngroup /> }
						tooltipTitle="Object ungroup"
					/>
				</Flex.Item>
				<Flex.Item className="rde-canvas-toolbar rde-canvas-toolbar-crop">
					<IconButton
						className="rde-action-btn"
						disabled={canvasRef ? !canvasRef.handler?.cropHandler.validType() : true}
						onClick={() => canvasRef.handler?.cropHandler.start()}
						icon={ <FaCrop /> }
						tooltipTitle="Crop"
					/>
					<IconButton
						className="rde-action-btn"
						disabled={canvasRef ? !canvasRef.handler?.cropHandler.cropRect : true}
						onClick={() => canvasRef.handler?.cropHandler.finish()}
						icon={ <FaCheck /> }
						tooltipTitle="Crop save"
					/>
					<IconButton
						className="rde-action-btn"
						disabled={canvasRef ? !canvasRef.handler?.cropHandler.cropRect : true}
						onClick={() => canvasRef.handler?.cropHandler.cancel()}
						icon={ <FaTimes /> }
						tooltipTitle="Crop cancel"
					/>
				</Flex.Item>
				<Flex.Item className="rde-canvas-toolbar rde-canvas-toolbar-operation">
					<IconButton
						className="rde-action-btn"
						disabled={isCropping}
						onClick={() => canvasRef.handler?.saveImage()}
						icon={ <FaImage /> }
						tooltipTitle="Save"
					/>
					<IconButton
						className="rde-action-btn"
						disabled={isCropping}
						onClick={() => canvasRef.handler?.duplicate()}
						icon={ <FaClone /> }
						tooltipTitle="Clone"
					/>
					<IconButton
						className="rde-action-btn"
						disabled={isCropping}
						onClick={() => canvasRef.handler?.remove()}
						icon={ <FaTrash /> }
						tooltipTitle="Delete"
					/>
				</Flex.Item>
				<Flex.Item className="rde-canvas-toolbar rde-canvas-toolbar-history">
					<IconButton
						className="rde-action-btn"
						disabled={isCropping || (canvasRef && !canvasRef.handler?.transactionHandler.undos.length)}
						onClick={() => canvasRef.handler?.transactionHandler.undo()}
						icon={ <FaUndoAlt /> }
						tooltipTitle="Undo"
					/>
					<IconButton
						className="rde-action-btn"
						disabled={isCropping || (canvasRef && !canvasRef.handler?.transactionHandler.redos.length)}
						onClick={() => canvasRef.handler?.transactionHandler.redo()}
						icon={ <FaRedoAlt /> }
						tooltipTitle="Redo"
					/>
				</Flex.Item>
			</Flex>
		);
	}
}

export default ImageMapHeaderToolbar;
